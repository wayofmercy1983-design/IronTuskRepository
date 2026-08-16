import { Link } from "react-router-dom";
import { playClick } from "../utils/playClick";

import "../styles/FeaturedArtistCard.css";

function FeaturedArtistCard({ artist }) {
  return (
    <article className="featured-artist-card glow-hover">
      <img
        src={artist.banner}
        alt={artist.name}
        className="featured-artist-image"
      />

      <div className="featured-artist-info">
        <h3>{artist.name}</h3>

        <p>{artist.genre}</p>

        <Link
          to={`/artists/${artist.slug}`}
          onClick={playClick}
        >
          <button type="button">
            View Artist
          </button>
        </Link>
      </div>
    </article>
  );
}

export default FeaturedArtistCard;