import React, { useState } from "react";
import axios from "axios";
import Styles from "./StationFinder.module.css"; 
import priceToggle from "../../images/priceToggle.png"; 

const StationFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearchTerm, setLastSearchTerm] = useState(""); 

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

    // Function to handle key presses in the input field
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Call the search function if Enter key is pressed
    }
  };

  const handleSearch = async () => {
    setSearchResults([]);
    setError(null);
    setLoading(true);
    setLastSearchTerm(searchTerm); 

    try {
      const response = await axios.get(
        `http://localhost:4000/api/services/locations/services`, 
        {
          params: {
            search: searchTerm,
          },
        }
      );
      setSearchResults(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to connect to the backend server. Please ensure your backend is running at http://localhost:4000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search Section */}
      <div className={Styles.search}>
        <h1 className={Styles.h1Search}>Search Z Stations</h1>
        <div>
          <input
            className={Styles.inputSearch}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by Location, Service, or Fuel"
          />

        </div>

        <button>Use my current Location</button>

        <img src={priceToggle} className={Styles.priceToggle} alt="Show price"/>

        {loading && <p>Loading results...</p>}

        {error && (
          <div>
            <strong>Error!</strong>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Station List Section */}
      <div>

        {searchResults.length > 0 && (
          <div>
            {searchResults.map((station) => (
              // Individual station display logic
              <div key={station.id}>
                <h3>{station.name}</h3>
                <p>
                  <span>Open Now:</span>{" "}
                  {station.is_open_now ? <span>Yes</span> : <span>No</span>}
                </p>
                {station.location && (
                  <p>
                    <span>Location:</span> {station.location.address},{" "}
                    {station.location.suburb}, {station.location.city} (
                    {station.location.latitude}, {station.location.longitude})
                  </p>
                )}
                {station.services && station.services.length > 0 && (
                  <div>
                    <p>Services:</p>
                    <ul>
                      {station.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {station.fuels && station.fuels.length > 0 && (
                  <div>
                    <p>Fuels:</p>
                    <ul>
                      {station.fuels.map((fuel, index) => (
                        <li key={index}>
                          {fuel.name} ({fuel.short_name}): $
                          {fuel.price?.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {searchResults.length === 0 && !loading && !error && searchTerm && (
          <p>No ZStations found for "{lastSearchTerm}".</p>
        )}
      </div>
    </div>
  );
};

export default StationFinder;
