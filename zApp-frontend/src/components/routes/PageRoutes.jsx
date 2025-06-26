import { Route, Routes } from "react-router-dom";
import HomeMain from "../pages/HomeMain";
import HomeResult from "../pages/HomeResult";
import HomeSearch from "../pages/HomeSearch";

export default function PageRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={HomeMain} />
        <Route path="/search" element={HomeSearch} />
        <Route path="/result" element={HomeResult} />
      </Routes>
    </div>
  );
}
