import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer"; 
import Styles from "./StationFinder.module.css";

// Import the newly separated components
import SearchBar from "./Searchbar";
import SearchResults from "./SearchResult";

import { icons } from "../utils/IconsLibrary";

// MAP CONTAINER STYLE AND DEFAULT CENTER
const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "8px",
  overflow: "hidden",
};
const defaultCenter = { lat: -36.8485, lng: 174.7633 };

const StationFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false); 
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // LOAD GOOGLE MAPS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.Maps_API_KEY,
    libraries: ["places"],
  });

  // MAP LOAD AND UNLOAD HANDLERS
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const onUnmount = useCallback(() => (mapRef.current = null), []);

  // FETCH STATIONS FUNCTION
  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowResultsModal(true); 
    try {
      const response = await axios.get(
        `http://localhost:4000/api/services/locations/services`,
        {
          params: { search: searchTerm },
        }
      );
      // Apply filters directly to the fetched data
      const filtered = response.data.filter(
        (station) =>
          selectedFilters.length === 0 ||
          (station.services &&
            selectedFilters.every((filter) =>
              station.services.some((service) =>
                service.toLowerCase().includes(filter.toLowerCase())
              )
            ))
      );
      setStations(filtered);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to connect to the backend server. Please ensure your backend is running at http://localhost:4000."
      );
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedFilters]); 

  // TRIGGER SEARCH INPUT ON ENTER
  const handleKeyDown = (event) => {
    if (event.key === "Enter") fetchStations();
  };

  // ADJUST MAP BOUNDS OR CENTER
  useEffect(() => {
    if (isLoaded && mapRef.current && stations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      stations.forEach((station) => {
        if (station.location?.latitude && station.location?.longitude) {
          bounds.extend({
            lat: parseFloat(station.location.latitude),
            lng: parseFloat(station.location.longitude),
          });
        }
      });
      mapRef.current.fitBounds(bounds);
    } else if (
      isLoaded &&
      mapRef.current &&
      stations.length === 0 &&
      searchTerm
    ) {
      // Reset to default view if no results for a search
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setZoom(5.5);
    } else if (isLoaded && mapRef.current && currentLocation) {
      mapRef.current.setCenter({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      });
      mapRef.current.setZoom(14);
    }
  }, [stations, isLoaded, searchTerm, currentLocation]);

  // HANDLE FILTER CHANGES
  const handleFilterChange = (filterType) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filterType)
        ? prevFilters.filter((filter) => filter !== filterType)
        : [...prevFilters, filterType]
    );
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position.coords);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  // Effect to re-fetch/re-filter when filters change *after* an initial search
  useEffect(() => {
    if (showResultsModal && searchTerm) {
      fetchStations();
    }
  }, [selectedFilters, showResultsModal, searchTerm, fetchStations]);

  // CLOSE SEARCH RESULTS MODAL and reset state related to search results
  const handleCloseSearchResults = () => {
    setShowResultsModal(false);
    setStations([]);
    setSearchTerm("");
    setShowFilterOptions(false); 
  };

  return (
    <div className={Styles.stationFinderContainer}>
      {/* SEARCH BAR COMPONENT */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleKeyDown={handleKeyDown}
        handleCloseSearchResults={handleCloseSearchResults}
        handleUseCurrentLocation={handleUseCurrentLocation}
        loading={loading}
        error={error}
      />

      {/* GOOGLE MAP CONTAINER */}
      <div className={Styles.googleMapContainerWrapper}>
        {loadError && <p>Error loading map: {loadError.message}</p>}
        {!isLoaded && !loadError && <p>Loading map...</p>}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={5.5}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{ disableDefaultUI: false }}
          >
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={{
                  lat: parseFloat(station.location.latitude),
                  lng: parseFloat(station.location.longitude),
                }}
                title={station.name}
                icon={{
                  url: icons.zMarkerIcon.url, 
                }}
                onClick={() => setSelectedStation(station)}
              />
            ))}

            {/* SEARCH RESULTS MODAL Component */}
            {showResultsModal && (
              <SearchResults
                stations={stations}
                loading={loading}
                searchTerm={searchTerm}
                showFilterOptions={showFilterOptions}
                setShowFilterOptions={setShowFilterOptions}
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
                onClose={handleCloseSearchResults}
              />
            )}

            {/* MARKER INFO WINDOWS */}
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
                  {selectedStation.services?.length > 0 && (
                    <p>Services: {selectedStation.services.join(", ")}</p>
                  )}
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