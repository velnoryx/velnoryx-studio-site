import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/india_db';
    console.log(`Connecting to MongoDB at: ${connString}`);
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Backend will fall back to using in-memory local data.');
    return false;
  }
};
