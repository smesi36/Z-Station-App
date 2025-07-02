import React from "react";
import Styles from "./StationFinder.module.css";

const LocationConsentModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={Styles.modalOverlay}>
      <div className={Styles.locationConsentModal}>
        <h2>Use Your Current Location?</h2>
        <p>Z Stations needs your precise location to show nearby stations.</p>
        <p className={Styles.privacyNote}>
          We only use your location to enhance your experience within the app.
          We do not sell your location data to third parties.
        </p>
        <div className={Styles.modalActions}>
          <button onClick={onConfirm} className={Styles.confirmButton}>
            Allow Location
          </button>
          <button onClick={onCancel} className={Styles.cancelButton}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationConsentModal;