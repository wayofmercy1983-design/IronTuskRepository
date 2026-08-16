import "../styles/Artist.css";
import artists from "../data/artists";
import ArtistCard from "../components/ArtistCard";

import { FaMicrophone, FaCompactDisc, FaMusic } from "react-icons/fa";

function Artists() {
  return (
    <section className="artists-page">
      <div className="artists-header">
        <h1>OUR ARTISTS</h1>
        <p>Meet the artists of Iron Tusk Records.</p>
      </div>

<div className="artist-search">
  <input
    type="text"
    placeholder="🔍 Search artists..."
  />

</div>

<div className="artist-stats">

  <div className="stat-card">
    <FaMicrophone className="stat-icon" />
    <h3>6</h3>
    <p>Artists</p>
  </div>

  <div className="stat-card">
    <FaCompactDisc className="stat-icon" />
    <h3>8</h3>
    <p>Releases</p>
  </div>

  <div className="stat-card">
    <FaMusic className="stat-icon" />
    <h3>5</h3>
    <p>Genres</p>
  </div>

</div>


<h2 className="roster-title">Featured Roster</h2>

<div className="artist-stats">

  <div className="stat-card">
    <h3>6</h3>
    <p>Artists</p>
  </div>

  <div className="stat-card">
    <h3>8</h3>
    <p>Releases</p>
  </div>

  <div className="stat-card">
    <h3>5</h3>
    <p>Genres</p>
  </div>

</div>

      <div className="artists-grid">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
          />
        ))}
      </div>
    </section>
  );
}

export default Artists;