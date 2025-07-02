import styles from "./ToggleSwitch.module.css";
import { useState } from "react";
import { icons } from "../utils/IconsLibrary.js";

export default function ToggleSwitch({ onToggle }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    onToggle?.(checked); // notify parent container if needed
  };
  return (
    <div className={styles.sliderWrapper}>
      <label className={styles.sliderContainer}>
        <input type="checkbox" checked={isChecked} onChange={handleToggle} />
        <div className={styles.slider}>
          <div className={styles.sliderHandle}>
            {isChecked ? (
              <>
                <span>Hide Price</span>
                <img src={icons.closePrice.url} alt="Close Price Icon" />
              </>
            ) : (
              <>
                <img src={icons.priceIcon.url} alt="Price Icon" />
                <span>Show Price</span>
              </>
            )}
          </div>
        </div>
      </label>
    </div>
  );
}
