import InteractiveMap from '../features/InteractiveMap.jsx';

import NavbarTop from '../common/NavBarTop.jsx';
import NavBarUnderTop from '../common/NavBarUnderTop.jsx';
import Footer from '../common/Footer.jsx';


export default function HomeMain() {
  return (
    <div>
      <NavbarTop />
      <NavBarUnderTop />
      <InteractiveMap />
      {/* <Footer /> */}
    </div>
  )
}