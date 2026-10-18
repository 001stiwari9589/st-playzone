import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_MONGODB_CONNECTION_STRING')) {
    console.warn('⚠️ MONGODB_URI is not configured in .env. Server will run in offline mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('💡 Note: Please update MONGODB_URI in .env with your MongoDB Atlas connection string.');
    return false;
  }
};

export const getDbStatus = () => {
  if (mongoose.connection.readyState === 1) return 'connected';
  if (mongoose.connection.readyState === 2) return 'connecting';
  return 'disconnected';
};
