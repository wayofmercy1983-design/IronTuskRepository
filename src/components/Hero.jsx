import { Link } from "react-router-dom";
import { playClick } from "../utils/playClick";

import heroImage from "../assets/Artists/thomas-banner.png";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <img src={heroImage} alt="Thomas Ate the Cat" className="hero-image" />
      <div className="hero-shade" />
      <div className="hero-container">
        <span className="hero-tag">Featured Artist</span>
        <p className="hero-kicker">IRON TUSK RECORDS PRESENTS</p>
        <h1>Thomas Ate<br />the Cat</h1>
        <p className="hero-copy">Alternative rock from Michigan. Honest songs, heavy guitars, and a new chapter on Iron Tusk Records.</p>
        <div className="hero-buttons">
          <Link to="/artists/thomas-ate-the-cat" className="primary-btn" onClick={playClick}>View Artist</Link>
          <Link to="/releases" className="secondary-btn" onClick={playClick}>Explore Music</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
