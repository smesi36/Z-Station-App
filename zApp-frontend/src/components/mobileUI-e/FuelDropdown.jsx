import { useState } from "react";
import styles from "./FuelDropdown.module.css";

// fuel options

const fuelOptions = ["Z91 Unleaded", "ZX Premium", "Z Diesel"];

export default function FuelDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("Fuel type");

  return (
    <div className={styles.dropdownContainer}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.dropdownButton}
      >
        Fuel type ▾
      </button>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {fuelOptions.map((fuel) => (
            <li 
            key={fuel} 
            className={styles.dropdownItem}
            onClick={() => onselect(fuel)}
            >
              {fuel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
