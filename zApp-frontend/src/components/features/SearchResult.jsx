import React from "react";
import Styles from "./StationFinder.module.css"; 
import filterIcon from "../../images/filterIcons.png";
import showResultsIcon from "../../images/showResultsIcons.png";
import XIconForShowResultsModal from "../../images/XIconForShowResultsModal.png";
import filterTag from "../../images/filterTag.png";
import { icons } from "../utils/IconsLibrary";

const SearchResult = ({
  stations,
  loading,
  searchTerm,
  showFilterOptions,
  setShowFilterOptions,
  selectedFilters,
  handleFilterChange,
  onClose,
}) => {
  const downArrowLightIcon = icons.downArrowLightIcon.url;

  return (
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
          onClick={onClose}
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
      {loading ? (
        <p>Loading results...</p>
      ) : stations.length > 0 ? (
        stations.map((station) => (
          <div key={station.id} className={Styles.stationCard}>
            <h4 className={Styles.stationNameH4}>{station.name}</h4>
            {station.location && (
              <p className={Styles.stationLocationP}>
                {station.location.city}
              </p>
            )}
            {station.services?.length > 0 && selectedFilters.length > 0 && (
              <div className={Styles.stationServicesDiv}>
                {station.services
                  .filter((service) =>
                    selectedFilters.some((filter) =>
                      service.toLowerCase().includes(filter.toLowerCase())
                    )
                  )
                  .map((service, index) => (
                    <div key={index} className={Styles.serviceTagContainer}>
                      <img
                        src={filterTag}
                        className={Styles.filterTag}
                        alt="Filter Tag"
                      />
                      <p className={Styles.serviceTagName}>
                        {service.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                    </div>
                  ))}
              </div>
            )}
            <p>
              <span className={Styles.stationOpenNowSpan}>Open Now</span>
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
      ) : (
        searchTerm && <p>No ZStations Services found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default SearchResult;