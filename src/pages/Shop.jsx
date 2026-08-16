import "./Shop.css";
import { useCart } from "../context/CartContext";

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
      </section>

      <section className="shop-products">
        {products.map((product) => (
          <article
            className="shop-card"
            key={product.id}
            onClick={() => handleAddToCart(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleAddToCart(product);
              }
            }}
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
                ${product.price.toFixed(2)}
              </div>

              <div className="shop-available">
                {product.availableDate}
              </div>

              <button
                type="button"
                className="shop-buy-button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                {product.button}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}