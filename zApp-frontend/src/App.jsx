import "./App.css";
import Footer from "./components/common/Footer.jsx";
import MainBody from "./components/common/MainBody.jsx";
import NavbarTop from "./components/common/NavBarTop.jsx";
import NavBarUnderTop from "./components/common/NavBarUnderTop.jsx";


function App() {
  return (
    <div>
      <NavbarTop />
      <NavBarUnderTop />
      <MainBody />
      <Footer />
      
    </div>
  );
}

export default App;
