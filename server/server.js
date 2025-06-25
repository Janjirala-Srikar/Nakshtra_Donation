// server.js
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');          // ← NEW
const userRoutes = require('./routes/user');

const app  = express();
const PORT = process.env.PORT || 5000;
const URI  = process.env.MONGODB_URI;

/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use(express.json());
app.use(cors());                             // ← NEW  (default “allow-all”)

/* ---------- ROUTES ---------- */
app.use('/api/users', userRoutes);

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
