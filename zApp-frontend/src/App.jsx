import "./App.css";
import Footer from "./components/common/Footer";
import MainBody from "./components/common/MainBody";
import NavbarTop from "./components/common/NavbarTop";
import HomeMain from "./components/pages/HomeMain";
import PageRoutes from "./components/routes/PageRoutes";

function App() {
  return (
    <div>
      <NavbarTop />
      <MainBody />
      <Footer />
      
    </div>
  );
}

export default App;
