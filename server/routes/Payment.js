const express = require('express');
const axios = require('axios');
const router = express.Router();
const nodemailer = require('nodemailer');

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

// Add a new route for sending email using nodemailer
router.post('/send-email', async (req, res) => {
  const { to_email, transaction_id, amount, status, date, pdf } = req.body;

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: to_email,
      subject: 'Thank You for Your Donation to Bhumi!',
      html: `
        <div style="font-family: Arial, sans-serif; background: #f7fafc; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto;">
          <div style="text-align: center;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqE5iXeHaFNj-skSCWJ51VtbLYGGGhCWLoDZpCVCQqC6fbXu5ZUsBvoAjAL8_UH2fYDXc&usqp=CAU"
                 alt="Donation Impact"
                 style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto 16px auto;" />
            <h1 style="color: #2563eb; margin-bottom: 8px;">Thank You for Your Generosity!</h1>
            <p style="font-size: 1.1em; color: #333; margin-bottom: 24px;">Your donation is helping us create a brighter future for children and communities in need.</p>
          </div>
          <div style="background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px #e0e7ef; margin-bottom: 24px;">
            <h2 style="color: #2563eb; margin-bottom: 12px;">Donation Details</h2>
            <ul style="list-style: none; padding: 0; color: #222; font-size: 1em;">
              <li><strong>Transaction ID:</strong> ${transaction_id}</li>
              <li><strong>Amount:</strong> $${amount} USD</li>
              <li><strong>Status:</strong> ${status}</li>
              <li><strong>Date:</strong> ${date}</li>
            </ul>
          </div>
          <div style="background: #e0f2fe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #0e7490; margin-bottom: 8px;">We Appreciate You!</h3>
            <ul style="color: #0e7490; font-size: 1em; padding-left: 20px;">
              <li>🌱 Your support enables us to provide education and resources to underprivileged children.</li>
              <li>🤝 You are now part of a community working for sustainable change.</li>
              <li>💡 Every contribution, big or small, makes a real difference.</li>
            </ul>
          </div>
          <div style="text-align: center; color: #555; font-size: 0.95em;">
            <p>With gratitude,<br><strong>The Bhumi Team</strong></p>
            <p style="margin-top: 16px; color: #888;">This is an automated confirmation for your recent donation. No goods or services were provided in exchange for this contribution.</p>
          </div>
        </div>
      `,
      attachments: pdf
        ? [{
            filename: 'donation_invoice.pdf',
            content: Buffer.from(pdf, 'base64'),
            contentType: 'application/pdf'
          }]
        : []
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
})

module.exports = router;