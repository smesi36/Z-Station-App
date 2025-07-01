import InteractiveMap from "../features/InteractiveMap.jsx";
import ToggleSwitch from "./ToggleSwitch.jsx";
import FuelDropdown from "./FuelDropdown.jsx";
import SearchInput from "./SearchInput.jsx";

import { icons } from "../utils/IconsLibrary.js";

import styles from "./MobileSearchUI.module.css"; // Assuming you have a CSS module for styles

export default function MobileSearchUI() {
  return (
    <div className={styles.mobileContainer}>
      <header className={styles.mNavbar}>
        <img src={icons.zLogo.url} alt="Z Logo" className={styles.zLogo} />
        <div className={styles.navIcons}>
          <img src={icons.searchLargeIcon.url} alt="Search" />
          <img src={icons.hambrgrMenu.url} alt="Menu" />
        </div>
      </header>
      <div className={styles.mSearchBar}>
        <h1 className={styles.searchTitle}>Search Z stations</h1>
        <SearchInput />
        <div className={styles.locationRow}>
          <img src={icons.locationIcon.url} alt="Location" />
          <p>Use my current location</p>
        </div>
        <div className={styles.controlsRow}>
          <ToggleSwitch />
          <FuelDropdown />
        </div>
      </div>
      <InteractiveMap />
    </div>
  );
}
