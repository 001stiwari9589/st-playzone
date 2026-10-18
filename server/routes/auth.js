import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fallback_secret_st_playzone',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if username or email already exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (userExists) {
      if (userExists.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }
      return res.status(400).json({ message: 'This username is already taken. Please choose another.' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: avatar || '🎮',
      points: 50, // Welcome bonus virtual points
      unlockedAchievements: ['welcome']
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        tagline: user.tagline,
        points: user.points,
        level: user.level,
        gamesPlayed: user.gamesPlayed,
        quizzesCompleted: user.quizzesCompleted,
        unlockedAchievements: user.unlockedAchievements,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    // Find by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase().trim() },
        { username: emailOrUsername.trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        tagline: user.tagline,
        points: user.points,
        level: user.level,
        gamesPlayed: user.gamesPlayed,
        quizzesCompleted: user.quizzesCompleted,
        unlockedAchievements: user.unlockedAchievements,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  return res.json({ user: req.user });
});

// @route   PUT /api/auth/profile
// @desc    Update username, avatar, or tagline
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, avatar, tagline } = req.body;
    const user = req.user;

    if (username && username.trim() !== user.username) {
      const existing = await User.findOne({ username: username.trim() });
      if (existing) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username.trim();
    }

    if (avatar) user.avatar = avatar;
    if (tagline !== undefined) user.tagline = tagline.trim();

    await user.save();

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        tagline: user.tagline,
        points: user.points,
        level: user.level,
        gamesPlayed: user.gamesPlayed,
        quizzesCompleted: user.quizzesCompleted,
        unlockedAchievements: user.unlockedAchievements,
        stats: user.stats
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed updating profile' });
  }
});

export default router;
