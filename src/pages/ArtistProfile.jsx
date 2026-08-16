import { Link, useParams } from "react-router-dom";
import artists from "../data/artists";
import releases from "../data/releases";

import "../styles/ArtistProfile.css";

function ArtistProfile() {
  const { slug } = useParams();

  const artist = artists.find((a) => a.slug === slug);

  if (!artist) {
    return (
      <section className="artist-profile not-found">
        <h1>Artist Not Found</h1>

        <p>
          The artist you're looking for doesn't exist.
        </p>
      </section>
    );
  }

  const artistReleases = releases.filter(
    (release) => release.artistSlug === artist.slug
  );

  return (
    <section className="artist-profile">

      <section className="artist-hero">

        <img
          src={artist.banner}
          alt={artist.name}
          className="artist-banner"
        />

        <div className="artist-info">

          <h1>{artist.name}</h1>

          <span className="artist-genre">
            {artist.genre}
          </span>

          <p className="artist-location">
            📍 {artist.hometown}
          </p>

          {artist.founded && (
            <p className="artist-location">
              🎵 Founded: {artist.founded}
            </p>
          )}

        </div>

      </section>

      <main className="artist-content">

        <section className="artist-biography">

          <h2>Biography</h2>

          <p>{artist.bio}</p>

        </section>

        {artist.members && artist.members.length > 0 && (

          <section className="artist-members">

            <h2>Band Members</h2>

            <ul>

              {artist.members.map((member, index) => (

                <li key={index}>
                  {member}
                </li>

              ))}

            </ul>

          </section>

        )}

        <section className="artist-releases">

          <h2>Releases</h2>

          {artistReleases.length > 0 ? (

            <div className="artist-release-list">

              {artistReleases.map((release) => (

                <article
                  key={release.id}
                  className="artist-release-card"
                >

                  <img
                    src={release.cover}
                    alt={release.title}
                    className="artist-release-cover"
                  />

                  <div className="artist-release-details">

                    <h3>{release.title}</h3>

                    <p className="release-meta">
                      {release.type} • {release.releaseDate}
                    </p>

                    <p>
                      {release.description}
                    </p>

                    <Link
                      to="/releases"
                      className="release-button"
                    >
                      View Releases
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <p>
              No releases available yet.
            </p>

          )}

        </section>

        {artist.funFacts && artist.funFacts.length > 0 && (

          <section className="artist-facts">

            <h2>Fun Facts</h2>

            <ul>

              {artist.funFacts.map((fact, index) => (

                <li key={index}>
                  {fact}
                </li>

              ))}

            </ul>

          </section>

        )}

        <section className="artist-socials">

          <h2>Connect</h2>

          <ul>

            {artist.socials?.spotify && (
              <li>
                <a
                  href={artist.socials.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spotify
                </a>
              </li>
            )}

            {artist.socials?.youtube && (
              <li>
                <a
                  href={artist.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>
            )}

            {artist.socials?.bandcamp && (
              <li>
                <a
                  href={artist.socials.bandcamp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bandcamp
                </a>
              </li>
            )}

            {artist.socials?.facebook && (
              <li>
                <a
                  href={artist.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
            )}

            {artist.socials?.instagram && (
              <li>
                <a
                  href={artist.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            )}

          </ul>

        </section>

      </main>

    </section>
  );
}

export default ArtistProfile;