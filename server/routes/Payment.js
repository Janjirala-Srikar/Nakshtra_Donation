const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;
const base = "https://api-m.sandbox.paypal.com"; // Sandbox URL

// Validate environment variables
if (!CLIENT || !SECRET) {
  console.error("❌ Missing PayPal credentials in .env file");
  console.error("Please create a .env file with:");
  console.error("PAYPAL_CLIENT_ID=your_client_id");
  console.error("PAYPAL_SECRET=your_secret");
  process.exit(1);
}

console.log("✅ PayPal Client ID loaded:", CLIENT ? "Present" : "Missing");
console.log("✅ PayPal Secret loaded:", SECRET ? "Present" : "Missing");

// Get Access Token
const getAccessToken = async () => {
  try {
    const response = await axios({
      url: `${base}/v1/oauth2/token`,
      method: "post",
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en_US",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      auth: {
        username: CLIENT,
        password: SECRET
      },
      params: {
        grant_type: "client_credentials"
      }
    });
    
    console.log("✅ Access token obtained successfully");
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Failed to get access token:", error.response?.data || error.message);
    throw error;
  }
};

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    console.log("📨 Creating order...");
    const accessToken = await getAccessToken();
    const { amount } = req.body;
    
    console.log("➡️ Incoming amount from frontend:", amount);
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      console.error("❌ Invalid amount sent from frontend:", amount);
      return res.status(400).json({ error: "Invalid amount" });
    }

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: parseFloat(amount).toFixed(2)
          }
        }
      ]
    };

    console.log("📦 Order data:", JSON.stringify(orderData, null, 2));

    const response = await axios.post(`${base}/v2/checkout/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Order created successfully:", response.data.id);
    res.json({ id: response.data.id });
    
  } catch (error) {
    console.error("❌ Error creating order:");
    if (error.response && error.response.data) {
      console.error("PayPal API Response Error:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Unknown error:", error.message);
    }
    res.status(500).json({ error: "Failed to create PayPal order", details: error.response?.data });
  }
});

// Capture Order
router.post("/capture-order/:orderId", async (req, res) => {
  try {
    console.log("💰 Capturing order...");
    const accessToken = await getAccessToken();
    const { orderId } = req.params;
    
    console.log("📋 Order ID:", orderId);
    
    const response = await axios.post(`${base}/v2/checkout/orders/${orderId}/capture`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("✅ Order captured successfully");
    console.log("Payment details:", JSON.stringify(response.data, null, 2));
    res.json(response.data);
    
  } catch (error) {
    console.error("❌ Error capturing order:");
    if (error.response && error.response.data) {
      console.error("PayPal API Response Error:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Unknown error:", error.message);
    }
    res.status(500).json({ error: "Failed to capture PayPal order", details: error.response?.data });
  }
});

module.exports = router;