import express from 'express';
import User from '../models/User.js';

const router = express.Router();

const SAMPLE_BENCHMARKS = [
  { id: 'sample-1', name: 'CyberViper', avatar: '🐍', points: 340, games: 42, badge: 'Grandmaster', isDemo: true },
  { id: 'sample-2', name: 'QuantumGlitch', avatar: '⚡', points: 290, games: 38, badge: 'Trivia Ace', isDemo: true },
  { id: 'sample-3', name: 'NovaStrike', avatar: '🚀', points: 265, games: 31, badge: 'Speed Demon', isDemo: true },
  { id: 'sample-4', name: 'PixelSamurai', avatar: '⚔️', points: 220, games: 27, badge: 'Tactician', isDemo: true },
  { id: 'sample-5', name: 'AstroMind', avatar: '🧠', points: 195, games: 22, badge: 'Quiz Explorer', isDemo: true },
  { id: 'sample-6', name: 'ShadowByte', avatar: '👾', points: 170, games: 19, badge: 'Puzzle King', isDemo: true },
  { id: 'sample-7', name: 'ZeroCool', avatar: '💎', points: 145, games: 16, badge: 'Arcade Rookie', isDemo: true },
];

// @route   GET /api/leaderboard
// @desc    Get top registered users and community benchmarks
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('username avatar points level gamesPlayed unlockedAchievements')
      .sort({ points: -1 })
      .limit(20)
      .lean();

    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      name: u.username,
      avatar: u.avatar || '🎮',
      points: u.points,
      games: u.gamesPlayed || 0,
      badge: `Level ${u.level || 1}`,
      isDemo: false
    }));

    // Merge registered users with benchmarks so leaderboard is lively
    const combined = [...formattedUsers, ...SAMPLE_BENCHMARKS]
      .sort((a, b) => b.points - a.points);

    return res.json({
      leaderboard: combined,
      registeredCount: users.length
    });
  } catch (error) {
    console.warn('Leaderboard DB query fallback:', error.message);
    // Graceful fallback if MongoDB is in offline mode
    return res.json({
      leaderboard: SAMPLE_BENCHMARKS,
      registeredCount: 0
    });
  }
});

export default router;
