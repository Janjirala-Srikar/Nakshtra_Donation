// server.js
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');          // ← NEW
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/Payment');

const app  = express();
const PORT = process.env.PORT || 5000;
const URI  = process.env.MONGODB_URI;

/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use(express.json({ limit: '10mb' }));
app.use(cors());                             // ← NEW  (default “allow-all”)

/* ---------- ROUTES ---------- */
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

/* ---------- DB → SERVER BOOTSTRAP ---------- */
mongoose
    .connect(URI)
    .then(function () {
        console.log('✓ Connected to MongoDB');
        app.listen(PORT, function () {
            console.log('✓ Server listening on port ' + PORT);
        });
    })
    .catch(function (err) {
        console.error('✗ MongoDB connection error:', err);
    });
