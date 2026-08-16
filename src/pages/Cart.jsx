import { useEffect, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

function Cart() {
  const {
    cart,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [configLoading, setConfigLoading] = useState(false);

  // --------------------------------------------------
  // LOAD PAYPAL CLIENT ID
  // --------------------------------------------------

  useEffect(() => {
    if (!showCheckout) {
      return;
    }

    const loadPayPalConfig = async () => {
      setConfigLoading(true);
      setPaymentMessage("");

      try {
        console.log("Loading PayPal configuration...");

        const response = await fetch(
          "http://localhost:4242/api/paypal/config"
        );

        if (!response.ok) {
          throw new Error(
            `PayPal config request failed: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("PayPal configuration received.");

        if (!data.clientId) {
          throw new Error(
            "PayPal Client ID was not returned."
          );
        }

        setPaypalClientId(data.clientId);
      } catch (error) {
        console.error(
          "PayPal configuration error:",
          error
        );

        setPaymentMessage(
          "PayPal could not be loaded. Make sure the PayPal server is running."
        );
      } finally {
        setConfigLoading(false);
      }
    };

    loadPayPalConfig();
  }, [showCheckout]);

  // --------------------------------------------------
  // CHECKOUT BUTTON
  // --------------------------------------------------

  const handleCheckout = () => {
    console.log("CHECKOUT BUTTON CLICKED");

    setPaymentMessage("");
    setPaypalClientId("");
    setShowCheckout(true);
  };

  // --------------------------------------------------
  // CREATE PAYPAL ORDER
  // --------------------------------------------------

  const createPayPalOrder = async () => {
    console.log("Creating PayPal order...");

    setPaypalLoading(true);
    setPaymentMessage("");

    try {
      const response = await fetch(
        "http://localhost:4242/api/paypal/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(totalPrice).toFixed(2),
          }),
        }
      );

      const data = await response.json();

      console.log("PayPal order response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create PayPal order."
        );
      }

      if (!data.id) {
        throw new Error(
          "PayPal did not return an order ID."
        );
      }

      return data.id;
    } catch (error) {
      console.error("PayPal order error:", error);

      setPaymentMessage(
        "We couldn't start PayPal checkout. Please try again."
      );

      throw error;
    } finally {
      setPaypalLoading(false);
    }
  };

  // --------------------------------------------------
  // CAPTURE PAYPAL ORDER
  // --------------------------------------------------

  const capturePayPalOrder = async (orderID) => {
    console.log("Capturing PayPal order:", orderID);

    setPaypalLoading(true);
    setPaymentMessage("");

    try {
      const response = await fetch(
        "http://localhost:4242/api/paypal/capture-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID,
          }),
        }
      );

      const data = await response.json();

      console.log("PayPal capture response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to capture payment."
        );
      }

      console.log(
        "PayPal payment completed successfully."
      );

      setPaymentMessage(
        "Payment successful! Thank you for your order."
      );

      clearCart();
    } catch (error) {
      console.error(
        "PayPal capture error:",
        error
      );

      setPaymentMessage(
        "Payment could not be completed. Please try again."
      );

      throw error;
    } finally {
      setPaypalLoading(false);
    }
  };

  // --------------------------------------------------
  // EMPTY CART
  // --------------------------------------------------

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <div className="shop-header">
          <h1>Your Shopping Cart</h1>
        </div>

        <div className="cart-empty">
          <p>Your cart is empty.</p>
        </div>
      </section>
    );
  }

  // --------------------------------------------------
  // CART PAGE
  // --------------------------------------------------

  return (
    <section className="cart-page">
      <div className="shop-header">
        <h1>Your Shopping Cart</h1>
      </div>

      {/* CART ITEMS */}

      {cart.map((item) => (
        <div
          key={item.id}
          className="cart-item"
        >
          <div className="cart-details">
            <h3>{item.name}</h3>

            <p>
              ${Number(item.price).toFixed(2)} each
            </p>

            <p>
              Subtotal: $
              {(
                Number(item.price) *
                Number(item.quantity)
              ).toFixed(2)}
            </p>
          </div>

          <div className="quantity-controls">
            <button
              type="button"
              onClick={() =>
                decreaseQuantity(item.id)
              }
            >
              −
            </button>

            <span className="quantity-number">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                increaseQuantity(item.id)
              }
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="remove-btn"
            onClick={() =>
              removeFromCart(item.id)
            }
          >
            Remove
          </button>
        </div>
      ))}

      {/* CART SUMMARY */}

      <div className="cart-summary">
        <h2>
          Total: $
          {Number(totalPrice).toFixed(2)}
        </h2>

        <div className="cart-buttons">

          {/* EMPTY CART */}

          <button
            type="button"
            className="clear-btn"
            onClick={() => {
              console.log("EMPTY CART CLICKED");
              clearCart();
            }}
          >
            Empty Cart
          </button>

          {/* CHECKOUT */}

          {!showCheckout && (
            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          )}
        </div>

        {/* PAYPAL CHECKOUT */}

        {showCheckout && (
          <div className="paypal-checkout">
            <h3>
              Complete Your Purchase
            </h3>

            <p className="checkout-total">
              Total: $
              {Number(totalPrice).toFixed(2)}
            </p>

            <div className="checkout-status">
              Checkout has started.
            </div>

            {/* PAYMENT MESSAGE */}

            {paymentMessage && (
              <div className="payment-message">
                {paymentMessage}
              </div>
            )}

            {/* LOADING CONFIGURATION */}

            {configLoading && (
              <p className="paypal-loading">
                Connecting to PayPal...
              </p>
            )}

            {/* PAYPAL BUTTON */}

            {!configLoading &&
              paypalClientId && (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      shape: "rect",
                      label: "paypal",
                    }}
                    createOrder={createPayPalOrder}
                    onApprove={async (data) => {
                      await capturePayPalOrder(
                        data.orderID
                      );
                    }}
                    onCancel={() => {
                      console.log(
                        "PayPal payment cancelled."
                      );

                      setPaymentMessage(
                        "Payment was cancelled."
                      );
                    }}
                    onError={(error) => {
                      console.error(
                        "PayPal checkout error:",
                        error
                      );

                      setPaymentMessage(
                        "PayPal encountered an error. Please try again."
                      );
                    }}
                  />
                </PayPalScriptProvider>
              )}

            {/* PAYPAL PREPARING */}

            {!configLoading &&
              !paypalClientId &&
              !paymentMessage && (
                <p className="paypal-loading">
                  Preparing PayPal checkout...
                </p>
              )}

            {/* PAYMENT PROCESSING */}

            {paypalLoading && (
              <p className="paypal-loading">
                Processing payment...
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;