import styles from "./MobilePage.module.css";
import MobileSearchUI from "./MobileSearchUI.jsx";

export default function MobilePage() {
  return (
    <div className={styles.mobilePage}>
      <MobileSearchUI />
    </div>
  );
}
