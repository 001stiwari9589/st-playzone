import { ACHIEVEMENTS } from '../data/achievements';
import { scoresAPI } from './api';

const PROFILE_KEY = 'st_playzone_profile';
const ACHIEVEMENTS_KEY = 'st_playzone_achievements';
const STATS_KEY = 'st_playzone_stats';

const DEFAULT_PROFILE = {
  username: 'Satyam Gamer',
  avatar: '⚡',
  tagline: 'Casual challenger on the road to Grandmaster',
  points: 40,
  level: 1,
  gamesPlayed: 0,
  quizzesCompleted: 0,
  lastActive: new Date().toISOString()
};

const DEFAULT_STATS = {
  snakeHighScore: 0,
  tictacWins: 0,
  memoryBestMoves: null,
  puzzleBestMoves: null,
  quizAccuracy: 0,
  totalQuizCorrect: 0,
  totalQuizAnswered: 0
};

// Dispatch event so active UI components update reactively
const notifyProfileUpdate = (profile, toast = null) => {
  window.dispatchEvent(
    new CustomEvent('st_profile_updated', {
      detail: { profile, toast }
    })
  );
};

export const getProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return { ...DEFAULT_PROFILE };
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed reading user profile', e);
    return { ...DEFAULT_PROFILE };
  }
};

export const saveProfile = (updates) => {
  try {
    const current = getProfile();
    const updated = { ...current, ...updates, lastActive: new Date().toISOString() };
    
    // Level formula: level = Math.floor(points / 50) + 1
    updated.level = Math.max(1, Math.floor(updated.points / 50) + 1);
    
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    notifyProfileUpdate(updated);
    return updated;
  } catch (e) {
    console.error('Failed saving profile', e);
    return getProfile();
  }
};

export const getStats = () => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
      return { ...DEFAULT_STATS };
    }
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed reading stats', e);
    return { ...DEFAULT_STATS };
  }
};

export const saveStats = (statUpdates) => {
  try {
    const current = getStats();
    const updated = { ...current, ...statUpdates };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed saving stats', e);
    return getStats();
  }
};

export const getUnlockedAchievements = () => {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) {
      const initial = ['welcome'];
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return ['welcome'];
  }
};

export const unlockAchievement = (id) => {
  try {
    const unlocked = getUnlockedAchievements();
    if (unlocked.includes(id)) return false;

    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return false;

    unlocked.push(id);
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));

    // Award bonus points for achievement
    const profile = getProfile();
    const newPoints = profile.points + (achievement.rewardPoints || 15);
    const updated = saveProfile({ points: newPoints });

    notifyProfileUpdate(updated, {
      type: 'achievement',
      title: `Achievement Unlocked: ${achievement.title}!`,
      message: `${achievement.description} (+${achievement.rewardPoints} ST Points)`
    });

    return true;
  } catch (e) {
    console.error('Failed unlocking achievement', e);
    return false;
  }
};

export const addPoints = (amount, reason = '') => {
  const profile = getProfile();
  const newPoints = profile.points + amount;
  const updated = saveProfile({ points: newPoints });

  notifyProfileUpdate(updated, {
    type: 'points',
    title: `+${amount} ST Points!`,
    message: reason || 'Keep playing to unlock new rewards!'
  });

  return updated;
};

export const recordGameEnd = ({ gameId, win = false, score = 0, moves = 0, timeSeconds = 0, pointsEarned = 0 }) => {
  const profile = getProfile();
  const stats = getStats();
  
  const updatedProfile = saveProfile({
    gamesPlayed: profile.gamesPlayed + 1
  });

  if (win) {
    unlockAchievement('first_win');
  }

  if (gameId === 'snake') {
    if (score > (stats.snakeHighScore || 0)) {
      saveStats({ snakeHighScore: score });
    }
    if (score >= 50) {
      unlockAchievement('snake_master');
    }
  }

  if (gameId === 'tic-tac-toe' && win) {
    saveStats({ tictacWins: (stats.tictacWins || 0) + 1 });
    unlockAchievement('tictac_champ');
  }

  if (gameId === 'memory' && win) {
    if (!stats.memoryBestMoves || moves < stats.memoryBestMoves) {
      saveStats({ memoryBestMoves: moves });
    }
    if (moves <= 16) {
      unlockAchievement('memory_wizard');
    }
  }

  if (gameId === 'puzzle' && win) {
    if (!stats.puzzleBestMoves || moves < stats.puzzleBestMoves) {
      saveStats({ puzzleBestMoves: moves });
    }
    unlockAchievement('puzzle_solver');
  }

  // Auto-sync game record with MongoDB if backend is connected
  try {
    scoresAPI.submitScore({
      gameId,
      win,
      score,
      moves,
      timeSeconds,
      pointsEarned,
      username: profile.username
    }).catch(() => {});
  } catch {
    // Graceful offline fallback
  }

  return updatedProfile;
};

export const recordQuizEnd = ({ category, correct, total, pointsEarned = 0 }) => {
  const profile = getProfile();
  const stats = getStats();

  const totalAnswered = (stats.totalQuizAnswered || 0) + total;
  const totalCorrect = (stats.totalQuizCorrect || 0) + correct;
  const accuracy = Math.round((totalCorrect / totalAnswered) * 100);

  saveStats({
    totalQuizAnswered: totalAnswered,
    totalQuizCorrect: totalCorrect,
    quizAccuracy: accuracy
  });

  saveProfile({
    quizzesCompleted: profile.quizzesCompleted + 1
  });

  unlockAchievement('quiz_explorer');

  if (category === 'daily') {
    unlockAchievement('daily_challenger');
  }

  if (correct === total && total > 0) {
    unlockAchievement('trivia_ace');
  }

  // Auto-sync quiz record with MongoDB
  try {
    scoresAPI.submitScore({
      gameId: 'quiz',
      win: correct > 0,
      score: correct,
      category,
      pointsEarned,
      username: profile.username
    }).catch(() => {});
  } catch {
    // Graceful offline fallback
  }
};
