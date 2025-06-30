import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Styles from "./StationFinder.module.css";
import priceToggle from "../../images/priceToggle.png";
import filterIcon from "../../images/filterIcons.png";
import LocationIcons from "../../images/LocationIcons.png";

import showResultsIcon from "../../images/showResultsIcons.png";
import XIconForShowResultsModal from "../../images/XIconForShowResultsModal.png";
import filterTag from "../../images/filterTag.png";
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
  }, [searchTerm, selectedFilters]); // Re-run if searchTerm or selectedFilters change

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

  // CLOSE SEARCH RESULTS MODAL
  const handleCloseSearchResults = () => {
    setShowResultsModal(false);
    setStations([]);
    setSearchTerm("");
  };

  // Destructure icon from utils for cleaner access
  const downArrowLightIcon = icons.downArrowLightIcon.url;
  const closeIcon = icons.closeIcon.url;

  return (
    <div className={Styles.stationFinderContainer}>
      {/* SEARCH SECTION */}
      <div className={Styles.search}>
        <h1 className={Styles.h1Search}>Search Z Stations</h1>
        <div className={Styles.inputWrapper}>
          <input
            className={Styles.inputSearch}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by Location, Service, or Fuel"
          />
          {searchTerm && (
            <span
              className={Styles.clearIcon}
              onClick={handleCloseSearchResults}
            >
              ✖
            </span>
          )}
        </div>
        <button
          onClick={handleUseCurrentLocation}
          className={Styles.currentLocationButton}
        >
          <img src={LocationIcons} className={Styles.locationButton} />
          Use my current Location
        </button>
        <img
          src={priceToggle}
          className={Styles.priceToggle}
          alt="Show price"
        />
        {loading && <p>Loading results...</p>}
        {error && (
          <div>
            <strong>Error!</strong> <span>{error}</span>
          </div>
        )}
      </div>

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
                onClick={() => setSelectedStation(station)}
              />
            ))}

            {/* SEARCH RESULTS MODAL */}
            {showResultsModal && (
              <div className={Styles.searchResultsContainer}>
                <div className={Styles.ResultModalTopNavContainer}>
                  <div>
                    <img
                      src={filterIcon}
                      className={Styles.filterIcon}
                      alt="Filter"
                      onClick={() => setShowFilterOptions(!showFilterOptions)}
                    />
                    <img
                      src={showResultsIcon}
                      className={Styles.showResultsIcon}
                      alt="Show Results"
                    />
                  </div>
                  <img
                    src={XIconForShowResultsModal}
                    className={Styles.XIconForShowResultsModal}
                    alt="Close"
                    onClick={() => {
                      setShowResultsModal(false);
                      setStations([]);
                      setSearchTerm("");
                    }}
                  />
                </div>

                {/* FILTER OPTIONS */}
                {showFilterOptions && (
                  <div className={Styles.filterOptionsDropdown}>
                    <h3>Filter by Service:</h3>
                    {["Carwash", "Coffee", "LPG"].map((filter) => (
                      <label key={filter}>
                        <input
                          type="checkbox"
                          value={filter}
                          checked={selectedFilters.includes(filter)}
                          onChange={() => handleFilterChange(filter)}
                        />
                        {filter}
                      </label>
                    ))}
                  </div>
                )}

                {/* SEARCH RESULTS */}
                {stations.length > 0
                  ? stations.map((station) => (
                      <div key={station.id} className={Styles.stationCard}>
                        <h4 className={Styles.stationNameH4}>{station.name}</h4>
                        {station.location && (
                          <p className={Styles.stationLocationP}>
                            {station.location.city}
                          </p>
                        )}
                        {station.services?.length > 0 &&
                          selectedFilters.length > 0 && (
                            <div className={Styles.stationServicesDiv}>
                              {station.services
                                .filter((service) =>
                                  selectedFilters.some((filter) =>
                                    service
                                      .toLowerCase()
                                      .includes(filter.toLowerCase())
                                  )
                                )
                                .map((service, index) => (
                                  <div
                                    key={index}
                                    className={Styles.serviceTagContainer}
                                  >
                                    <img
                                      src={filterTag}
                                      className={Styles.filterTag}
                                      alt="Filter Tag"
                                    />
                                    <p className={Styles.serviceTagName}>
                                      {service
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          )}
                        <p>
                          <span className={Styles.stationOpenNowSpan}>
                            Open Now
                          </span>
                          {station.is_open_now ? (
                            <span>
                              <img
                                src={downArrowLightIcon}
                                className={Styles.downArrowLightIcon}
                                alt="Open Now"
                              />
                            </span>
                          ) : (
                            <span>No</span>
                          )}
                        </p>
                      </div>
                    ))
                  : !loading &&
                    searchTerm && (
                      <p>No ZStations Services found for "{searchTerm}".</p>
                    )}
              </div>
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
