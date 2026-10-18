import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/st_playzone';

console.log('🔍 Testing MongoDB connection to:', uri.replace(/\/\/.*@/, '//<credentials>@'));

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ Success! Connected to MongoDB successfully.');
  console.log('Database Name:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  await mongoose.disconnect();
  console.log('Connection closed safely.');
  process.exit(0);
} catch (error) {
  console.error('❌ Connection Failed:', error.message);
  console.error('\nTips:');
  console.error('1. Check if your IP address is whitelisted in MongoDB Atlas (Network Access -> 0.0.0.0/0).');
  console.error('2. Make sure username and password in MONGODB_URI are correct.');
  console.error('3. If running locally, make sure mongod is running.');
  process.exit(1);
}
