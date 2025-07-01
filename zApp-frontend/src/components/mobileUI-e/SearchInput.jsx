import styles from "./SearchInput.module.css";
import { icons } from "../utils/IconsLibrary.js";

export default function SearchInput() {
  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        // onChange={handleSearchInput}
        placeholder="Search by locatin, services, fuel"
        className={styles.searchBox}
      />
      <img src={icons.searchIcon.url} alt="Search" className={styles.searchIcon} />
    </div>
  );
}
