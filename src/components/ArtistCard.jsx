import { useNavigate } from "react-router-dom";
import { playClick } from "../utils/playClick";

import "../styles/ArtistCard.css";

function ArtistCard({ artist }) {
  const navigate = useNavigate();

  const handleClick = () => {
    playClick();

    // Give the browser a moment to start the sound
    setTimeout(() => {
      navigate(`/artists/${artist.slug}`);
    }, 40);
  };

  return (
    <article
      className="artist-card artist-link"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="artist-banner">
        <img
          src={artist.banner}
          alt={artist.name}
        />
      </div>

      <div className="artist-overlay">
        <div className="artist-header">
          <h2>{artist.name}</h2>

          <span className="genre-badge">
            {artist.genre}
          </span>
        </div>

        <p className="artist-location">
          📍 {artist.hometown}
        </p>

        <p className="artist-bio">
          {artist.bio.length > 140
            ? `${artist.bio.substring(0, 140)}...`
            : artist.bio}
        </p>

        <div className="artist-button">
          <span>View Artist</span>
          <span className="arrow">→</span>
        </div>
      </div>
    </article>
  );
}

export default ArtistCard;