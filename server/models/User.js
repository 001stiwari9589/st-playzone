import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    avatar: {
      type: String,
      default: '🎮'
    },
    tagline: {
      type: String,
      default: 'Casual challenger on the road to Grandmaster',
      maxlength: 60
    },
    points: {
      type: Number,
      default: 50
    },
    level: {
      type: Number,
      default: 1
    },
    gamesPlayed: {
      type: Number,
      default: 0
    },
    quizzesCompleted: {
      type: Number,
      default: 0
    },
    unlockedAchievements: {
      type: [String],
      default: ['welcome']
    },
    stats: {
      snakeHighScore: { type: Number, default: 0 },
      tictacWins: { type: Number, default: 0 },
      memoryBestMoves: { type: Number, default: null },
      puzzleBestMoves: { type: Number, default: null },
      quizAccuracy: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook for password hashing and level calculation
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified('points')) {
    this.level = Math.max(1, Math.floor(this.points / 50) + 1);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
