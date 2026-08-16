import { Link } from "react-router-dom";
import { playClick } from "../utils/playClick";

import "../styles/LatestReleases.css";

import releases from "../data/releases";
import ReleaseCard from "./ReleaseCard";

function LatestReleases() {
  // Show only the newest four releases on the Home page
  const featuredReleases = releases.slice(0, 4);

  return (
    <section className="latest-releases">
      <div className="section-header">
        <div>
          <h2>Latest Releases</h2>
          <p>
            Explore the newest music from Iron Tusk Records.
          </p>
        </div>

        <Link
          to="/releases"
          className="view-all-btn"
          onClick={playClick}
        >
          View All Releases →
        </Link>
      </div>

      <div className="release-grid">
        {featuredReleases.map((release) => (
          <ReleaseCard
            key={release.id}
            release={release}
            compact
          />
        ))}
      </div>
    </section>
  );
}

export default LatestReleases;