import artists from "../data/artists";
import ArtistCard from "../components/ArtistCard";
import "../styles/Releases.css";

export default function Artists() {
  return (
    <main className="releases-page artists-page">
      <header className="releases-header">
        <span className="page-eyebrow">The Roster</span>
        <h1>Artists</h1>
        <p>Meet the independent artists building their next chapter with Iron Tusk Records.</p>
      </header>
      <section className="artists-directory-grid">
        {artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
      </section>
    </main>
  );
}
