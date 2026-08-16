import { useParams, Link } from "react-router-dom";
import releases from "../data/releases";
import artists from "../data/artists";
import "./ReleasePage.css";

export default function ReleasePage() {
  const { slug } = useParams();

  const release = releases.find((r) => r.slug === slug);

  if (!release) {
    return (
      <div className="release-page">
        <h1>Release Not Found</h1>
        <Link to="/releases">← Back to Releases</Link>
      </div>
    );
  }

  const artist = artists.find((a) => a.slug === release.artistSlug);

  const moreReleases = releases.filter(
    (r) =>
      r.artistSlug === release.artistSlug &&
      r.slug !== release.slug
  );

  return (
    <div className="release-page">
      <div className="release-header">
        <img
          src={release.cover}
          alt={release.title}
          className="release-cover"
        />

        <div className="release-info">
          <h1>{release.title}</h1>

          <h2>
            by{" "}
            <Link to={`/artists/${artist.slug}`}>
              {artist.name}
            </Link>
          </h2>

          <p className="release-meta">
            {release.type} • {release.year}
          </p>

          <div className="stream-links">
            {release.links.spotify && (
              <a
                href={release.links.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Spotify
              </a>
            )}

            {release.links.apple && (
              <a
                href={release.links.apple}
                target="_blank"
                rel="noreferrer"
              >
                Apple Music
              </a>
            )}

            {release.links.youtube && (
              <a
                href={release.links.youtube}
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            )}

            {release.links.bandcamp && (
              <a
                href={release.links.bandcamp}
                target="_blank"
                rel="noreferrer"
              >
                Bandcamp
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="release-section">
        <h3>About This Release</h3>

        <p>{release.description}</p>
      </section>

      <section className="release-section">
        <h3>Track Listing</h3>

        <ol className="track-list">
          {release.tracks.map((track, index) => (
            <li key={index}>{track}</li>
          ))}
        </ol>
      </section>

      <section className="release-section">
        <h3>Credits</h3>

        <p>
          <strong>Written by:</strong>{" "}
          {release.credits.writtenBy}
        </p>

        <p>
          <strong>Produced by:</strong>{" "}
          {release.credits.producedBy}
        </p>

        <p>
          <strong>Released by:</strong>{" "}
          {release.credits.label}
        </p>

        <p>{release.credits.copyright}</p>
      </section>

      {moreReleases.length > 0 && (
        <section className="release-section">
          <h3>More Releases by {artist.name}</h3>

          <div className="more-releases">
            {moreReleases.map((item) => (
              <Link
                key={item.slug}
                to={`/release/${item.slug}`}
                className="more-release-card"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                />

                <h4>{item.title}</h4>

                <p>{item.year}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}