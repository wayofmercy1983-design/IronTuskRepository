import "../styles/Releases.css";
import releases from "../data/releases";
import ReleaseCard from "../components/ReleaseCard";

export default function Releases() {
  return (
    <main className="releases-page">
      <header className="releases-header">
        <span className="page-eyebrow">The Catalog</span>
        <h1>Releases</h1>
        <p>
          Explore the official Iron Tusk Records catalog, featuring albums,
          EPs, and singles from our artists.
        </p>
      </header>

      <section className="releases-grid">
        {releases.map((release) => (
          <ReleaseCard
            key={release.id}
            release={release}
          />
        ))}
      </section>
    </main>
  );
}
