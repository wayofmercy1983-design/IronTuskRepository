import "../styles/ShopCard.css";

function ShopCard() {
  return (
    <div className="shop-card under-construction">

      <div className="shop-placeholder">
        🛍️
      </div>

      <h2>Store Under Construction</h2>

      <p>
        The Iron Tusk Records Store is currently being built.
      </p>

      <p>
        Check back soon for exclusive artist merchandise,
        CDs, vinyl, apparel, and collectibles.
      </p>

      <button disabled className="construction-button">
        Coming Soon
      </button>

    </div>
  );
}

export default ShopCard;