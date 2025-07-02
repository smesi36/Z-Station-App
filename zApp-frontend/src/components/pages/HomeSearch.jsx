import InteractiveMap from "../features/InteractiveMap";
import StationFinder from "../features/StationFinder";

import NavbarTop from "../common/NavBarTop.jsx";
import NavBarUnderTop from "../common/NavBarUnderTop.jsx";
import Footer from "../common/Footer.jsx";

export default function HomeSearch() {
  return (
    <div>
      <NavbarTop />
      <NavBarUnderTop />
      <StationFinder />
      {/* <InteractiveMap /> */}
      {/* <Footer /> */}
    </div>
  );
}
