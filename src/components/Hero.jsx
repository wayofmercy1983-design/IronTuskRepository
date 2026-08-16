import { Link } from "react-router-dom";
import { playClick } from "../utils/playClick";

import heroImage from "../assets/Artists/thomas-banner.png";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <span className="hero-tag">
            Independent Record Label
          </span>

          <h1>
            Independent.
            <br />
            Authentic.
            <br />
            Unstoppable.
          </h1>

          <p>
            Welcome to <strong>Iron Tusk Records</strong>, home to passionate
            independent artists, unforgettable music, and a commitment to
            building lasting relationships with the musicians we represent.
          </p>

          <div className="hero-buttons">
            <Link
              to="/contact"
              className="secondary-btn"
              onClick={playClick}
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-wrapper">
            <img
              src={heroImage}
              alt="Thomas Ate the Cat"
              className="hero-image"
            />

            <div className="hero-badge">
              First Signed Artist
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;