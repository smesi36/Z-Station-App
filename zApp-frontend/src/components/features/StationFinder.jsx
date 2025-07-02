import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// Import your custom components and utilities
import Styles from "./StationFinder.module.css";
import SearchBar from "./Searchbar";
import SearchResults from "./SearchResult";
import LocationConsentModal from "./LocationConsentModal";
import { icons } from "../utils/IconsLibrary";
import { getDistanceFromLatLonInKm } from "../utils/haversine";

// Component Constants
const CONTAINER_STYLE = {
  width: "100%",
  height: "500px",
  borderRadius: "8px",
  overflow: "hidden",
};
const DEFAULT_CENTER = { lat: -41.2865, lng: 174.7762 };
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// ✅ DEFINE LIBRARIES ARRAY OUTSIDE THE COMPONENT
const libraries = ["places", "marker"];

const StationFinder = () => {
  // === STATE HOOKS ===
  const [stations, setStations] = useState([]);
  const [inputValue, setInputValue] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uiState, setUiState] = useState({
    resultsVisible: false,
    filtersVisible: false,
    consentVisible: false,
  });
  const [googleMaps, setGoogleMaps] = useState(null);

  // Refs to hold map, clusterer, and listeners for cleanup
  const mapRef = useRef(null);
  const clustererRef = useRef(null);
  const listenersRef = useRef([]);

  // === GOOGLE MAPS API LOADER ===
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: libraries, 
  });

  // === MAIN EFFECT FOR DATA FETCHING ===
  useEffect(() => {
    const hasActiveFilter =
      searchTerm || selectedFilters.length > 0 || currentLocation;

    if (!hasActiveFilter) {
      setStations([]);
      setUiState((prev) => ({ ...prev, resultsVisible: false }));
      return;
    }

    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setUiState((prev) => ({ ...prev, resultsVisible: true }));

      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        selectedFilters.forEach((filter) => params.append("service", filter));

        const response = await axios.get(
          `${API_BASE_URL}/api/services/locations/services`,
          {
            params,
            signal: abortController.signal,
          }
        );

        let results = response.data;

        if (currentLocation) {
          results = results.filter((station) => {
            const { latitude, longitude } = station.location || {};
            if (!latitude || !longitude) return false;
            const distance = getDistanceFromLatLonInKm(
              currentLocation.latitude,
              currentLocation.longitude,
              parseFloat(latitude),
              parseFloat(longitude)
            );
            return distance <= 10;
          });
        }
        setStations(results);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to load station data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [searchTerm, selectedFilters, currentLocation]);

  // Effect to auto-clear search term when input is cleared
  useEffect(() => {
    if (inputValue === "") {
      setSearchTerm("");
    }
  }, [inputValue]);

  // === MAP & MARKER RENDERING LOGIC ===
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !googleMaps) return;

    const map = mapRef.current;

    listenersRef.current.forEach((listener) => listener.remove());
    listenersRef.current = [];
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    const validStations = stations.filter(
      (station) =>
        station.location &&
        !isNaN(parseFloat(station.location.latitude)) &&
        !isNaN(parseFloat(station.location.longitude))
    );

    if (validStations.length === 0) return;

    const stationMarkers = validStations.map((station) => {
      const marker = new googleMaps.Marker({
        position: {
          lat: parseFloat(station.location.latitude),
          lng: parseFloat(station.location.longitude),
        },
        title: station.name,
        icon: {
          url: icons.zMarkerIcon.url,
          scaledSize: new googleMaps.Size(48, 48),
        },
      });
      const listener = marker.addListener("click", () =>
        setSelectedStation(station)
      );
      listenersRef.current.push(listener);
      return marker;
    });

    const renderer = {
      render: ({ markers, position }) => {
        const size = markers.length > 30 ? 60 : markers.length > 10 ? 50 : 38;
        return new googleMaps.Marker({
          position,
          icon: {
            url: icons.areaPinOrangeIcon.url,
            scaledSize: new googleMaps.Size(size, size),
          },
          map,
        });
      },
    };

    clustererRef.current = new MarkerClusterer({
      map,
      markers: stationMarkers,
      renderer,
    });

    const clusterListener = clustererRef.current.addListener(
      "clusterclick",
      (event, cluster) => {
        map.panTo(cluster.position);
        map.setZoom(Math.min(map.getZoom() + 2, 16));
      }
    );
    listenersRef.current.push(clusterListener);

    if (validStations.length > 0) {
      const bounds = new googleMaps.LatLngBounds();
      validStations.forEach((s) => {
        bounds.extend({
          lat: parseFloat(s.location.latitude),
          lng: parseFloat(s.location.longitude),
        });
      });
      map.fitBounds(bounds);
    }

    
  }, [stations, isLoaded, googleMaps]);

  // === EVENT HANDLERS ===
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setSearchTerm(inputValue);
    }
  };

  const handleFilterChange = (filterType) => {
    setSelectedFilters((prev) =>
      prev.includes(filterType)
        ? prev.filter((f) => f !== filterType)
        : [...prev, filterType]
    );
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return setError("Geolocation is not supported by your browser.");
    }
    setUiState((prev) => ({ ...prev, consentVisible: true }));
  };

  const handleConfirmLocationAccess = () => {
    setUiState((prev) => ({ ...prev, consentVisible: false }));
    setInputValue("");
    setSearchTerm("");
    setSelectedFilters([]);
    navigator.geolocation.getCurrentPosition(
      (position) => setCurrentLocation(position.coords),
      () => setError("Unable to retrieve your location.")
    );
  };

  const handleCloseSearchResults = () => {
    setInputValue("");
    setSearchTerm("");
    setSelectedFilters([]);
    setCurrentLocation(null);
    setError(null);
    if (mapRef.current) {
      mapRef.current.panTo(DEFAULT_CENTER);
      mapRef.current.setZoom(6);
    }
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    if (window.google) {
      setGoogleMaps(window.google.maps);
    }
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    listenersRef.current.forEach((listener) => listener.remove());
    listenersRef.current = [];
  }, []);

  // === RENDER ===
  if (loadError) return <p>Error loading map: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className={Styles.stationFinderContainer}>
      <SearchBar
        searchTerm={inputValue}
        setSearchTerm={setInputValue}
        handleKeyDown={handleKeyDown}
        handleCloseSearchResults={handleCloseSearchResults}
        handleUseCurrentLocation={handleUseCurrentLocation}
        loading={loading}
        error={error}
      />

      {uiState.consentVisible && (
        <LocationConsentModal
          onConfirm={handleConfirmLocationAccess}
          onCancel={() =>
            setUiState((prev) => ({ ...prev, consentVisible: false }))
          }
        />
      )}

      <div className={Styles.googleMapContainerWrapper}>
        <GoogleMap
          mapContainerStyle={CONTAINER_STYLE}
          center={DEFAULT_CENTER}
          zoom={6}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ disableDefaultUI: false }}
        >
          {uiState.resultsVisible && (
            <SearchResults
              stations={stations}
              loading={loading}
              searchTerm={searchTerm}
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
              showFilterOptions={uiState.filtersVisible}
              setShowFilterOptions={(visible) =>
                setUiState((prev) => ({ ...prev, filtersVisible: visible }))
              }
              onClose={handleCloseSearchResults}
            />
          )}

          {selectedStation && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedStation.location.latitude),
                lng: parseFloat(selectedStation.location.longitude),
              }}
              onCloseClick={() => setSelectedStation(null)}
            >
              <div>
                <h4>{selectedStation.name}</h4>
                <p>
                  {selectedStation.location.address ||
                    selectedStation.location.city}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default StationFinder;
