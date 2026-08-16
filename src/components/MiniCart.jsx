import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/MiniCart.css";

function MiniCart({ isOpen, onClose }) {
  const {
    cart,
    totalPrice,
    removeFromCart,
  } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="mini-cart-overlay"
          onClick={onClose}
        />
      )}

      <div className={`mini-cart ${isOpen ? "open" : ""}`}>
        <div className="mini-cart-header">
          <h2>Your Cart</h2>

          <button onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <p className="empty-cart">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="mini-cart-items">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="mini-cart-item"
                >
                  <div>
                    <h4>{item.name}</h4>

                    <p>
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    className="remove-mini"
                    onClick={() => removeFromCart(item.id)}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <div className="mini-cart-footer">
              <h3>Total</h3>

              <h2>${totalPrice.toFixed(2)}</h2>

              <NavLink to="/cart">
                <button className="checkout-btn">
                  View Cart
                </button>
              </NavLink>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MiniCart;