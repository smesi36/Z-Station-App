// import google-map components
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "800px",
};

// Center on the coordinates of New Zealand
const center = {
  lat: -41.2865,
  lng: 174.7762,
};

export default function InteractiveMap() {
  const [stations, setStations] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

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

  return (
    <div>
      {/* conditionally render the map when isLoaded is true (API key is valid) */}
      {!isLoaded ? (
        <p>Loading map...</p> // Render a loading message while the map is loading
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5.5}
        >
          {stations.map((station) => (
            <Marker
              key={station.id}
              position={{
                lat: parseFloat(station.location.latitude),
                lng: parseFloat(station.location.longitude),
              }}
              title={station.name}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}
