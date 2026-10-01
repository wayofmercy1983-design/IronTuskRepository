import { NavLink } from "react-router-dom";
import { playClick } from "../utils/playClick";

import "../styles/Footer.css";
import logo from "../assets/logo/logo.png";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-brand">
      <div className="footer-logo">
        <NavLink
          to="/"
          className="logo-card"
          onClick={playClick}
        >
          <img
            src={logo}
            alt="Iron Tusk Records"
          />
        </NavLink>
      </div>
      <h3>IRON TUSK RECORDS LTD.</h3>
      <p>Independent. Authentic. Unstoppable.</p>
      </div>

      <div className="footer-nav-groups">
      <nav className="footer-links">
        <strong>Explore</strong>
        <NavLink to="/" onClick={playClick}>
          Home
        </NavLink>

        <NavLink to="/releases" onClick={playClick}>
          Releases
        </NavLink>

        <NavLink to="/artists" onClick={playClick}>Artists</NavLink>

        <NavLink to="/shows" onClick={playClick}>
          Shows
        </NavLink>

      </nav>

      <nav className="footer-links">
        <strong>Iron Tusk</strong>
        <NavLink to="/shop" onClick={playClick}>Shop</NavLink>
        <NavLink to="/about" onClick={playClick}>About</NavLink>
        <NavLink to="/contact" onClick={playClick}>Contact</NavLink>
      </nav>
      </div>

      <small className="footer-legal">
        © 2026 Iron Tusk Records Ltd. All Rights Reserved.
      </small>

    </footer>
  );
}

export default Footer;
