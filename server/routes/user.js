const express = require('express');
const User = require('../models/User');
const verifyToken = require('../middleware/VerifyToken');

const router = express.Router();



// 🔹 Email/Password Signup
router.post('/signup', verifyToken, async (req, res) => {
  const { name, username, email, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, username, email, phone });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Google Sign-in
router.post('/google-signin', verifyToken, async (req, res) => {
  const { email, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, username: email.split('@')[0],phone: null  });
      await user.save();
    }
    res.status(200).json({ message: 'Google sign-in success' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Google Signup (Optional - if you want separate logic for signup)
router.post('/google-signup', verifyToken, async (req, res) => {
  const { email, name, phone, uid, photoURL } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const username = email.split('@')[0];

    user = new User({
      name,
      email,
      phone: phone || '',
      username,
      uid,
      photoURL,
    });

    await user.save();
    res.status(201).json({ message: 'Google user signed up' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user details
router.get('/me', verifyToken, async (req, res) => {
  try {
    // req.user should be set by verifyToken middleware (Firebase UID)
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user details
router.put('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, username, phone } = req.body;
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
