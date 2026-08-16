import "../styles/FeaturedArtists.css";
import FeaturedArtistCard from "./FeaturedArtistCard";
import artists from "../data/artists";

function FeaturedArtists() {

  // Show only the first three featured artists
  const featuredArtists = artists.slice(0, 8
    
  );

  return (
    <section className="featured-artists">

      <div className="section-header">

        <div>
          <h2>Featured Artists</h2>

          <p>
            Meet the artists shaping the sound of Iron Tusk Records.
          </p>
        </div>

      </div>

      <div className="artist-grid">

        {featuredArtists.map((artist) => (
          <FeaturedArtistCard
            key={artist.id}
            artist={artist}
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedArtists;