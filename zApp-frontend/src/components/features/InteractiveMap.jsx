// import google-map components
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
// Import the MarkerClusterer from the Google Maps JavaScript API
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// Import the utility to dynamically render prices in the price markers
import { generatePriceMarker } from "../utils/generatePriceMarker.js";

import { icons } from "../utils/IconsLibrary.js";

// Define the style for the map container
const containerStyle = {
  width: "100%",
  height: "800px",
};

// Center on the coordinates of New Zealand
const center = {
  lat: -41.2865,
  lng: 174.7762,
};

export default function InteractiveMap({
  showPrices = false,
  fuelType = null,
}) {
  const [stations, setStations] = useState([]);
  const mapRef = useRef(null); // Create a ref to store the map instance
  const [googleMaps, setGoogleMaps] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Load the Maps API modules
  useEffect(() => {
    if (isLoaded && window.google) {
      setGoogleMaps(window.google.maps);
    }
  }, [isLoaded]);

  useEffect(() => {
    // Fetch the stations data from the API using axios
    const fetchStations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/stations/locations"
        );
        setStations(response.data);
      } catch (error) {
        console.error("Failed to fetch stations:", error.message);
      }
    };

    fetchStations();
  }, []);

  const handleMapLoad = (map) => {
    mapRef.current = map; // Store the map instance for future reference
  };

  useEffect(() => {
    if (!mapRef.current || stations.length === 0 || !googleMaps) return;

    const map = mapRef.current;

    // validation of station location and fuel type
    const stationMarkers = stations
      .filter((station) => {
        const hasValidLocation =
          station.location?.latitude && station.location?.longitude;
        const matchesFuel =
          !fuelType || station.fuels?.some((fuel) => fuel.name === fuelType);
        return hasValidLocation && matchesFuel;
      })
      .map((station) => {
        const marker = new googleMaps.Marker({
          position: {
            lat: parseFloat(station.location.latitude),
            lng: parseFloat(station.location.longitude),
          },
          title: station.name,

          icon: showPrices
            ? generatePriceMarker(station.price)
            : icons.zMarkerIcon,
          visible: false, // Start hidden
          map,
        });
        return marker;
      });

    const clusterer = new MarkerClusterer({
      map,
      markers: stationMarkers,
      gridSize: 300,
      minimumClusterSize: 5,
      maxZoom: 14,
      renderer: {
        render: ({ markers, position }) => {
          let size;
          // Adjust the size of the cluster based on marker count
          if (markers.length > 30) size = 60;
          else if (markers.length > 10) size = 50;
          else size = 38;
          return new googleMaps.Marker({
            position,
            icon: {
              ...(showPrices ? icons.areaPinBlueIcon : icons.areaPinOrangeIcon),
              scaledSize: new googleMaps.Size(size, size),
            },
            map,
          });
        },
      },
    });

    // ✅ Add zoom_changed inside this effect
    const zoomListener = googleMaps.event.addListener(
      map,
      "zoom_changed",
      () => {
        const currentZoom = map.getZoom();
        const shouldShowStations = currentZoom >= 7;

        stationMarkers.forEach((marker) => {
          marker.setVisible(shouldShowStations);
        });
      }
    );

    // ✅ Smooth zoom on cluster click
    googleMaps.event.addListener(clusterer, "clusterclick", (event) => {
      const cluster = event;
      const map = mapRef.current;

      const position = cluster.getCenter();
      const currentZoom = map.getZoom();
      const targetZoom = Math.min(currentZoom + 2, 15);

      // Smooth pan first
      map.panTo(position);

      // Then zoom in after a short delay (500ms)
      setTimeout(() => {
        map.setZoom(targetZoom);
      }, 500);
    });

    return () => {
      clusterer.clearMarkers();
      googleMaps.event.removeListener(zoomListener); // Clean up listener
    };
  }, [stations, googleMaps, showPrices, fuelType]); // Re-run when stations data or mapsApi changes

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5.9}
      onLoad={handleMapLoad}
    />
  );
}
