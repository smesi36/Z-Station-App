import styles from "./ToggleSwitch.module.css";

import { icons } from "../utils/IconsLibrary.js";

export default function ToggleSwitch() {
  return (
    <label className={styles.switchContainer}>
      <input type="checkbox" />
      <span className={styles.slider}></span>
      <span className={styles.labelIcon}>
        <img src={icons.priceIcon.url} alt="Price" /> Show Price
      </span>
    </label>
  );
}
