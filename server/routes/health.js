import express from 'express';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// @route   GET /api/health
// @desc    Health check & DB connection status
router.get('/', (req, res) => {
  const dbStatus = getDbStatus();
  return res.json({
    status: 'ok',
    app: 'ST PlayZone Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    instructions: dbStatus === 'connected'
      ? 'MongoDB is connected and operational.'
      : 'MongoDB is disconnected. Please check MONGODB_URI in your .env file.'
  });
});

export default router;
