import { ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/CartButton.css";

function CartButton() {
  const { cart } = useCart();

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <NavLink to="/cart" className="cart-button">
      <ShoppingCart size={22} />

      {itemCount > 0 && (
        <span className="cart-count">
          {itemCount}
        </span>
      )}
    </NavLink>
  );
}

export default CartButton;