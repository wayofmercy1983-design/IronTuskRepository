import "./Shop.css";
import { useCart } from "../context/CartContext";
import { catalog } from "../data/catalog";

const products = [
  {
    id: "thomas-power-chords",
    artist: "Thomas Ate the Cat",
    title: "Power Chords and Other Nonsense",
    type: "ALBUM",
    price: 12.0,
    image: "/shop/power-chords.png",
    button: "Pre-Order Album",
    availableDate: "PRE-ORDER — Ships October 30, 2026",
  },
  {
    id: "snot-rockets-ep",
    artist: "The Snot Rockets",
    title: "The Snot Rockets",
    type: "EP",
    price: 8.0,
    image: "/shop/snot-rockets.jpg",
    button: "Pre-Order EP",
    availableDate: "PRE-ORDER — Ships October 30, 2026",
  },
  ...catalog,
];

export default function Shop() {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      artist: product.artist,
    });
  };

  return (
    <main className="shop-page">
      <section className="shop-hero">
        <h1>IRON TUSK SHOP</h1>

        <p>
          Music from the artists of Iron Tusk Records.
        </p>
        <p>CD and vinyl prices exclude shipping. Shipping is calculated on Kunaki.</p>
        <a className="shop-buy-button" href="https://kunaki.com/MSales.asp?PublisherId=246886&PP=1" target="_blank" rel="noopener noreferrer">Buy multiple releases ↗</a>
        <p>Politics and Other Strange Tales vinyl is available through its individual link below.</p>
      </section>

      <section className="shop-products">
        {products.map((product) => (
          <article
            className="shop-card"
            key={product.id}
          >
            <div className="shop-image-container">
              <img
                src={product.image}
                alt={`${product.artist} - ${product.title}`}
                className="shop-product-image"
              />
            </div>

            <div className="shop-card-info">
              <p className="shop-product-type">
                {product.artist}
              </p>

              <h2>{product.title}</h2>

              <div className="shop-product-type">
                {product.type}
              </div>

              <div className="shop-price">
                {product.price != null ? `$${product.price.toFixed(2)}` : 'Purchase options coming soon'}
              </div>

              <div className="shop-available">
                {product.availableDate || (product.buyUrl ? 'AVAILABLE NOW' : '')}
              </div>

              {product.buyUrl ? (
                <>
                  <a className="shop-buy-button" href={product.buyUrl} target="_blank" rel="noopener noreferrer" aria-label={`Buy ${product.title} CD (opens a new tab)`}>Buy CD ↗</a>
                  <p className="shop-purchase-note">Pay through PayPal on Kunaki. Shipping calculated there.</p>
                </>
              ) : product.button ? <button
                type="button"
                className="shop-buy-button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                {product.button}
              </button> : null}
              {product.vinylUrl && (
                <div className="shop-vinyl">
                  <p>Vinyl · {product.vinylPrice ? `${product.vinylPrice} plus shipping` : 'See price and shipping on Kunaki'}</p>
                  <a className="shop-buy-button" href={product.vinylUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${product.title} vinyl (opens a new tab)`}>View vinyl ↗</a>
                  <p className="shop-purchase-note">Choose “buy record (retail)” on Kunaki.</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
