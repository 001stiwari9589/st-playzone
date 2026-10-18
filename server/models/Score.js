import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    gameId: {
      type: String,
      required: true,
      enum: ['snake', 'tic-tac-toe', 'memory', 'puzzle', 'quiz']
    },
    score: {
      type: Number,
      default: 0
    },
    moves: {
      type: Number,
      default: 0
    },
    timeSeconds: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: ''
    },
    win: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Score = mongoose.model('Score', scoreSchema);
export default Score;
