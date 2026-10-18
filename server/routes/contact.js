import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact message and save to MongoDB
router.post('/', async (req, res) => {
  try {
    const { name, email, topic = 'feedback', message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || !email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email address is required' });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters long' });
    }

    const dbStatus = getDbStatus();
    let savedDoc = null;

    if (dbStatus === 'connected') {
      savedDoc = await ContactMessage.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        topic,
        message: message.trim()
      });
    } else {
      console.log('📝 Contact message captured in memory (MongoDB offline):', { name, email, topic, message });
    }

    return res.status(201).json({
      success: true,
      message: 'Your message has been received and logged.',
      databaseSaved: dbStatus === 'connected',
      entry: savedDoc ? { id: savedDoc._id, name: savedDoc.name, createdAt: savedDoc.createdAt } : null
    });
  } catch (error) {
    console.error('Contact Submission Error:', error);
    return res.status(500).json({ message: 'Failed to process message' });
  }
});

export default router;
