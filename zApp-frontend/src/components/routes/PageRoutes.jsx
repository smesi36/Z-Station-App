import { Route, Routes } from "react-router-dom";
import HomeMain from "../pages/HomeMain";
import HomeResult from "../pages/HomeResult";
import HomeSearch from "../pages/HomeSearch";
import MobilePage from "../mobileUI-e/MobilePage.jsx"; // Importing Erekle's mobile screen component


export default function PageRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeMain />} />
        <Route path="/search" element={<HomeSearch />} />
        <Route path="/result" element={<HomeResult />} />
        {/* Erekle's mobile screen route */}
        <Route path="/mobile-ui" element={<MobilePage />} />
      </Routes>
    </div>
  );
}
