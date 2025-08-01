import { useState } from "react";
import styles from "./FuelDropdown.module.css";

import { icons } from "../utils/IconsLibrary.js"; 

// fuel options

const fuelOptions = [
  { label: "91 Unleaded", value: "z91unleaded" },
  { label: "Premium 98", value: "zxpremium" },
  { label: "Diesel", value: "zdiesel" },
];


export default function FuelDropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.dropdownContainer}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.dropdownButton}
      >
        Fuel type <img src={icons.downArrowWhite.url} alt="Down Arrow" />
      </button>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {fuelOptions.map((fuel) => (
            <li
              key={fuel.value}
              className={styles.dropdownItem}
              onClick={() => {
                onSelect(fuel.value);
                setIsOpen(false);
              }}
            >
              {fuel.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
