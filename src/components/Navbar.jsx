import { NavLink } from "react-router-dom";

import logo from "../assets/logo/logo.png";
import CartButton from "./CartButton";

import { playClick } from "../utils/playClick";

import "../styles/Navbar.css";

function Navbar() {
  return (
    <>
    <div className="announcement-bar">INDEPENDENT MUSIC. ARTIST-FIRST. BUILT IN THE MIDWEST.</div>
    <header className="navbar">
      <div className="nav-logo">
        <NavLink to="/" onClick={playClick}>
          <img src={logo} alt="Iron Tusk Records" />
        </NavLink>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/" onClick={playClick}>
          HOME
        </NavLink>

        <NavLink to="/artists" onClick={playClick}>
          ARTISTS
        </NavLink>

        <NavLink to="/releases" onClick={playClick}>
          RELEASES
        </NavLink>

        <NavLink to="/shows" onClick={playClick}>
          SHOWS
        </NavLink>

        <NavLink to="/about" onClick={playClick}>
          ABOUT
        </NavLink>

        <NavLink to="/contact" onClick={playClick}>
          CONTACT
        </NavLink>
      </nav>

      <div className="nav-actions">
        <NavLink
          to="/shop"
          className="shop-btn"
          onClick={playClick}
        >
          SHOP
        </NavLink>

        <NavLink
          to="/cart"
          onClick={playClick}
          aria-label="Shopping Cart"
        >
          <CartButton />
        </NavLink>
      </div>
    </header>
    </>
  );
}

export default Navbar;
