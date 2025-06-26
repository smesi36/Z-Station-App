import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { icons } from "../utils/IconsLibrary.js";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const center = {
  lat: -41.2865,
  lng: 174.7762,
};

export default function InteractiveMap() {
  const [stations, setStations] = useState([]);
  const mapRef = useRef(null);
  const [googleMaps, setGoogleMaps] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      setGoogleMaps(window.google.maps);
    }
  }, [isLoaded]);

  useEffect(() => {
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
    mapRef.current = map;
  };

  useEffect(() => {
    if (!mapRef.current || stations.length === 0 || !googleMaps) return;

    const map = mapRef.current;

    const markers = stations
      .filter(
        (station) =>
          station.location?.latitude && station.location?.longitude
      )
      .map((station) => {
        return new googleMaps.Marker({
          position: {
            lat: parseFloat(station.location.latitude),
            lng: parseFloat(station.location.longitude),
          },
          title: station.name,
          icon: icons.zMarkerIcon,
          map: map,
        });
      });

    const clusterer = new MarkerClusterer({
      map,
      markers,
      gridSize: 50,
      minimumClusterSize: 2,
      maxZoom: 15,
      renderer: {
        render: ({ count, position }) => {
          return new googleMaps.Marker({
            position,
            label: {
              text: String(count),
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            },
            icon: icons.areaPinOrangeIcon,
            map,
          });
        },
      },
    });

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
    };
  }, [stations, googleMaps]);

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5.5}
      onLoad={handleMapLoad}
    />
  );
}

