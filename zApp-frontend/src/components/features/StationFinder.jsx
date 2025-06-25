import React, { useState, useEffect } from "react";
import axios from "axios";

const StationFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle changes in the search input field
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to perform the search when the button is clicked
  const handleSearch = async () => {
    setSearchResults([]);
    setError(null);
    setLoading(true); 

    try {
      const response = await axios.get(
        `http://localhost:4000/api/services/locations/services`,
        {
          params: {
            service: searchTerm, 
          },
        }
      );
      setSearchResults(response.data); 
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch services. Please try again."); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 font-sans flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          ZStation Service Search
        </h1>

        {/* Search Input and Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="e.g., Coffee, Car Wash, LPG"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm text-gray-700"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading} 
          >
            {loading ? "Searching..." : "Search Services"}
          </button>
        </div>

        {loading && (
          <p className="text-center text-blue-600 font-medium text-lg animate-pulse mb-4">
            Loading results...
          </p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <div className="mt-6">
          {searchResults.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 italic">
              Enter a service (e.g., 'Coffee') and click search to find
              ZStations.
            </p>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((station) => (
                <div
                  key={station.id}
                  className="bg-gray-50 p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {station.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">ID:</span> {station.id}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Open Now:</span>{" "}
                    {station.is_open_now ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Location:</span>{" "}
                    {station.location.latitude}, {station.location.longitude}
                  </p>
                  {station.services && station.services.length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold text-gray-700 mb-1">
                        Services:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 pl-4">
                        {station.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {station.fuels && station.fuels.length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold text-gray-700 mb-1">Fuels:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 pl-4">
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
            <p className="text-center text-gray-500 italic mt-4">
              No ZStations found for "{searchTerm}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationFinder;
