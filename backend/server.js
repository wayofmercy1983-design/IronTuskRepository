import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --------------------------------------------------
// Load .env from the backend folder
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// --------------------------------------------------
// Express setup
// --------------------------------------------------

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// PayPal LIVE
// --------------------------------------------------

const PAYPAL_API = "https://api-m.paypal.com";

// --------------------------------------------------
// Check PayPal credentials
// --------------------------------------------------

console.log(
  "PayPal Client ID loaded:",
  process.env.PAYPAL_CLIENT_ID ? "YES" : "NO"
);

console.log(
  "PayPal Client Secret loaded:",
  process.env.PAYPAL_CLIENT_SECRET ? "YES" : "NO"
);

// --------------------------------------------------
// Get PayPal Access Token
// --------------------------------------------------

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal credentials are missing. Check backend/.env"
    );
  }

  const auth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API}/v1/oauth2/token`,
    {
      method: "POST",

      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: "grant_type=client_credentials",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `PayPal authentication failed: ${errorText}`
    );
  }

  const data = await response.json();

  return data.access_token;
}

// --------------------------------------------------
// PayPal configuration
// --------------------------------------------------

app.get("/api/paypal/config", (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      error: "PayPal Client ID is missing.",
    });
  }

  res.json({
    clientId,
  });
});

// --------------------------------------------------
// Create PayPal Order
// --------------------------------------------------

app.post(
  "/api/paypal/create-order",
  async (req, res) => {
    try {
      const { amount } = req.body;

      console.log(
        "Creating PayPal LIVE order for amount:",
        amount
      );

      if (
        amount === undefined ||
        amount === null ||
        Number(amount) <= 0
      ) {
        return res.status(400).json({
          error: "Invalid payment amount.",
        });
      }

      const accessToken =
        await getPayPalAccessToken();

      const response = await fetch(
        `${PAYPAL_API}/v2/checkout/orders`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            intent: "CAPTURE",

            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: Number(amount).toFixed(2),
                },
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "PayPal create order error:",
          data
        );

        return res.status(response.status).json({
          error:
            "Unable to create PayPal order.",
          details: data,
        });
      }

      console.log(
        "PayPal LIVE order created:",
        data.id
      );

      res.json({
        id: data.id,
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Server error while creating PayPal order.",
      });
    }
  }
);

// --------------------------------------------------
// Capture PayPal Order
// --------------------------------------------------

app.post(
  "/api/paypal/capture-order",
  async (req, res) => {
    try {
      const { orderID } = req.body;

      console.log(
        "Capturing PayPal LIVE order:",
        orderID
      );

      if (!orderID) {
        return res.status(400).json({
          error:
            "Missing PayPal order ID.",
        });
      }

      const accessToken =
        await getPayPalAccessToken();

      const response = await fetch(
        `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "PayPal capture error:",
          data
        );

        return res.status(response.status).json({
          error:
            "Unable to capture PayPal payment.",

          details: data,
        });
      }

      console.log(
        "PayPal LIVE payment captured successfully."
      );

      res.json(data);
    } catch (error) {
      console.error(
        "Capture order error:",
        error
      );

      res.status(500).json({
        error:
          error.message ||
          "Server error while capturing PayPal payment.",
      });
    }
  }
);

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status:
      "Iron Tusk PayPal LIVE backend is running.",
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `Iron Tusk PayPal LIVE server running on http://localhost:${PORT}`
  );
});