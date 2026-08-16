import { Link } from "react-router-dom";
import "../styles/ReleaseCard.css";
import artists from "../data/artists";

export default function ReleaseCard({ release, compact = false }) {
  const artist = artists.find(
    (artist) => artist.slug === release.artistSlug
  );

  const statusClass = release.status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <article className={`release-card ${compact ? "compact" : ""}`}>
      <img
        src={release.cover}
        alt={release.title}
        className="release-cover"
      />

      <div className="release-content">
        <h2>{release.title}</h2>

        {artist && (
          <Link
            to={`/artists/${artist.slug}`}
            className="artist-link"
          >
            {artist.name}
          </Link>
        )}

        <div className="release-details">
          <span>{release.type}</span>
          <span>•</span>
          <span>{release.releaseDate}</span>
        </div>

        <div className={`status ${statusClass}`}>
          {release.status}
        </div>

        <div className="genre">
          {release.genre}
        </div>

        {!compact && (
          <p className="description">
            {release.description}
          </p>
        )}

        <div className="release-links">
          {release.links.spotify && (
            <a
              href={release.links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="listen-button"
            >
              Spotify
            </a>
          )}

          {release.links.apple && (
            <a
              href={release.links.apple}
              target="_blank"
              rel="noopener noreferrer"
              className="listen-button"
            >
              Apple Music
            </a>
          )}

          {release.links.youtube && (
            <a
              href={release.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="listen-button"
            >
              YouTube
            </a>
          )}

          {release.links.bandcamp && (
            <a
              href={release.links.bandcamp}
              target="_blank"
              rel="noopener noreferrer"
              className="listen-button"
            >
              Bandcamp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}