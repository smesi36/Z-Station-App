import Styles from "./Searchbar.module.css";
import LocationIcons from "../../images/LocationIcons.png";
import ToggleSwitch from "../mobileUI-e/ToggleSwitch";

const Searchbar = ({
  searchTerm,
  setSearchTerm,
  handleKeyDown,
  handleCloseSearchResults,
  handleUseCurrentLocation,
  loading,
  error,
}) => {
  return (
    <div className={Styles.searchBarContainer}>
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
          <span className={Styles.clearIcon} onClick={handleCloseSearchResults}>
            ✖
          </span>
        )}
      </div>
      <button
        onClick={handleUseCurrentLocation}
        className={Styles.currentLocationButton}
      >
        <img
          src={LocationIcons}
          className={Styles.locationButton}
          alt="Location Icon"
        />
        Use my current Location
      </button>
      <ToggleSwitch />
      {loading && <p>Loading results...</p>}
      {error && (
        <div className={Styles.errorMessage}>
          <strong>Error!</strong> <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
