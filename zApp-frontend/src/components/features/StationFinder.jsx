import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import Styles from "./StationFinder.module.css";
import SearchBar from "./Searchbar";
import SearchResults from "./SearchResult";
import LocationConsentModal from "./LocationConsentModal";
import { icons } from "../utils/IconsLibrary";
import { getDistanceFromLatLonInKm } from "../utils/haversine";

// Component constants
const containerStyle = { width: "100%", height: "500px", borderRadius: "8px", overflow: "hidden" };
const defaultCenter = { lat: -41.2865, lng: 174.7762 };
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const StationFinder = () => {
  // State Hooks
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showLocationConsentModal, setShowLocationConsentModal] = useState(false);
  const mapRef = useRef(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
    libraries: ["places", "marker"],
  });

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Main data fetching and filtering effect
  useEffect(() => {
    const hasActiveFilter = debouncedSearchTerm || selectedFilters.length > 0 || currentLocation;
    
    // Don't fetch if there are no filters
    if (!hasActiveFilter) {
      setStations([]);
      setShowResultsModal(false);
      return;
    }

    const abortController = new AbortController();

    const fetchAndFilterStations = async () => {
      setLoading(true);
      setError(null);
      setShowResultsModal(true);

      try {
        // 1. Build query params to send filters to the backend
        const params = new URLSearchParams();
        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }
        selectedFilters.forEach(filter => {
          params.append("service", filter);
        });

        const response = await axios.get(`${API_BASE_URL}/api/services/locations/services`, {
          params,
          signal: abortController.signal,
        });

        let results = response.data;

        // 2. Apply client-side distance filter on the returned data
        if (currentLocation) {
          results = results.filter(station => {
            if (!station.location?.latitude || !station.location?.longitude) return false;
            const distance = getDistanceFromLatLonInKm(currentLocation.latitude, currentLocation.longitude, parseFloat(station.location.latitude), parseFloat(station.location.longitude));
            return distance <= 20; // 20km radius
          });
        }
        setStations(results);

      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching stations:", err);
          setError("Failed to load station data.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndFilterStations();

    // Cleanup function to cancel the request if dependencies change
    return () => abortController.abort();
  }, [debouncedSearchTerm, selectedFilters, currentLocation]);


  // Adjust map bounds when stations change
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    
    if (stations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      stations.forEach(station => {
        if (station.location?.latitude && station.location?.longitude) {
           bounds.extend({ lat: parseFloat(station.location.latitude), lng: parseFloat(station.location.longitude) });
        }
      });
      mapRef.current.fitBounds(bounds);
    } else if (currentLocation) {
      mapRef.current.setCenter({ lat: currentLocation.latitude, lng: currentLocation.longitude });
      mapRef.current.setZoom(14);
    }
  }, [stations, isLoaded, currentLocation]);


  // Event Handlers
  const handleFilterChange = (filterType) => {
    setSelectedFilters(prev => prev.includes(filterType) ? prev.filter(f => f !== filterType) : [...prev, filterType]);
  };
  
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return setError("Geolocation is not supported by your browser.");
    }
    setShowLocationConsentModal(true);
  };
  
  const handleConfirmLocationAccess = () => {
    setShowLocationConsentModal(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchTerm("");
        setSelectedFilters([]);
        setCurrentLocation(position.coords);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setError("Unable to retrieve your location.");
      }
    );
  };

  const handleCloseSearchResults = () => {
    setShowResultsModal(false);
    setSearchTerm("");
    setSelectedFilters([]);
    setCurrentLocation(null);
    setError(null);
    if (mapRef.current) {
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setZoom(6);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setDebouncedSearchTerm(searchTerm); // Trigger search immediately
    }
  };

  // Map load handlers
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const onUnmount = useCallback(() => (mapRef.current = null), []);

  return (
    <div className={Styles.stationFinderContainer}>
      <SearchBar {...{ searchTerm, setSearchTerm, handleKeyDown, handleCloseSearchResults, handleUseCurrentLocation, loading, error }} />

      {showLocationConsentModal && <LocationConsentModal onConfirm={handleConfirmLocationAccess} onCancel={() => setShowLocationConsentModal(false)} />}
      
      <div className={Styles.googleMapContainerWrapper}>
        {loadError && <p>Error loading map: {loadError.message}</p>}
        {!isLoaded && !loadError && <p>Loading map...</p>}
        {isLoaded && (
          <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={6} onLoad={onLoad} onUnmount={onUnmount} options={{ disableDefaultUI: false }}>
            <MarkerClusterer>
              {(clusterer) =>
                stations.map((station) => (
                  <Marker
                    key={station.id || `${station.location.latitude}-${station.location.longitude}-${station.name}`}
                    position={{ lat: parseFloat(station.location.latitude), lng: parseFloat(station.location.longitude) }}
                    title={station.name}
                    icon={{ url: icons.zMarkerIcon.url, scaledSize: new window.google.maps.Size(30, 30) }}
                    onClick={() => setSelectedStation(station)}
                    clusterer={clusterer}
                  />
                ))
              }
            </MarkerClusterer>

            {showResultsModal && (
              <SearchResults stations={stations} {...{ loading, searchTerm, showFilterOptions, setShowFilterOptions, selectedFilters, handleFilterChange }} onClose={handleCloseSearchResults} />
            )}

            {selectedStation && (
              <InfoWindow position={{ lat: parseFloat(selectedStation.location.latitude), lng: parseFloat(selectedStation.location.longitude) }} onCloseClick={() => setSelectedStation(null)}>
                <div>
                  <h4>{selectedStation.name}</h4>
                  <p>{selectedStation.location.address || selectedStation.location.city}</p>
                  {selectedStation.services?.length > 0 && <p>Services: {selectedStation.services.join(", ")}</p>}
                  <p>{selectedStation.is_open_now ? "Open Now" : "Closed"}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default StationFinder;