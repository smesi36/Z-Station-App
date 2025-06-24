import React, { useState } from 'react';
import styles from './NavBarTop.module.css';
import logo from '../../images/LogoZ.png';
import forPersonal from '../../images/forPersonal.png';
import forBusiness from '../../images/forBusiness.png';
import aboutZ from '../../images/aboutZ.png';
import zApp from '../../images/zApp.png';
import search from '../../images/search.png';

// SVG icon for the close (X) mark
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M1 17L17 1M1 1L17 17" stroke="#353535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// SVG icon for the hamburger menu (Bars)
const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
    <path d="M0 2V0H18V2H0ZM0 14V12H18V14H0ZM0 8V6H18V8H0Z" fill="#353535"/>
  </svg>
);


function NavbarTop() {
  const [isOpen, setIsOpen] = useState(false);

  // OPEN MENU FUNCTION
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // CLOSE MENU FUNCTION
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.navbar}>
      {/* LOGO */}
      <img src={logo} className={styles.logo} alt="Company Logo" />
      <img
        src={forPersonal}
        className={styles.forPersonal}
        alt="for Personal button"
      />
      <img
        src={forBusiness}
        className={styles.forB}
        alt="for Business button"
      />

      {/* HAMBURGER/ XMARK MENU ICON */}
      <div className={styles["menu-icon"]} onClick={toggleMenu}>
        {" "}
        {/* Had to use [] for menu-icon because of hyphen */}
        {isOpen ? (
          // Show Xmark when menu is open
          <CloseIcon />
        ) : (
          // Show Bars when menu is closed
          <HamburgerIcon />
        )}
      </div>

      {/* TOP NAV CONTENT AND LOGIN */}
      <div className={`${styles.loginAndNav} ${isOpen ? styles.open : ""}`}>
        <a href="#news" onClick={closeMenu}>
          <img src={zApp} alt="Z App" />
        </a>
        <a href="#about" onClick={closeMenu}>
          <img src={aboutZ} alt="About Z" />
        </a>
        <a href="#search" onClick={closeMenu}>
          <img src={search} alt="Search" />
        </a>
        {/* LOGIN BUTTON */}
        <button className={styles.loginButton}>Login</button>
      </div>
    </div>
  );
}

export default NavbarTop;