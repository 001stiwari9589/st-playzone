import express from 'express';
import Score from '../models/Score.js';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/scores
// @desc    Record game or quiz score
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { gameId, score = 0, moves = 0, timeSeconds = 0, win = false, category = '', pointsEarned = 0 } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: 'gameId is required' });
    }

    const username = req.user ? req.user.username : (req.body.username || 'Guest Player');
    const userId = req.user ? req.user._id : null;

    // Save score entry
    const newScore = await Score.create({
      userId,
      username,
      gameId,
      score,
      moves,
      timeSeconds,
      win,
      category
    });

    // If registered user, update user career statistics
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (gameId === 'quiz') {
          user.quizzesCompleted += 1;
        } else {
          user.gamesPlayed += 1;
        }

        if (pointsEarned > 0) {
          user.points += pointsEarned;
        }

        // Update personal high scores
        if (gameId === 'snake' && score > (user.stats.snakeHighScore || 0)) {
          user.stats.snakeHighScore = score;
        }
        if (gameId === 'tic-tac-toe' && win) {
          user.stats.tictacWins = (user.stats.tictacWins || 0) + 1;
        }
        if (gameId === 'memory' && win) {
          if (!user.stats.memoryBestMoves || moves < user.stats.memoryBestMoves) {
            user.stats.memoryBestMoves = moves;
          }
        }
        if (gameId === 'puzzle' && win) {
          if (!user.stats.puzzleBestMoves || moves < user.stats.puzzleBestMoves) {
            user.stats.puzzleBestMoves = moves;
          }
        }

        await user.save();
      }
    }

    return res.status(201).json({
      message: 'Score recorded successfully',
      score: newScore
    });
  } catch (error) {
    console.error('Score submission error:', error);
    return res.status(500).json({ message: 'Failed to record score' });
  }
});

export default router;
