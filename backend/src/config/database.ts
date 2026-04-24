import mongoose from 'mongoose';
import { ENV } from './env';

export async function connectDB(): Promise<void> {
  const uri = ENV.MONGODB_URI;
  await mongoose.connect(uri);
  console.log('MongoDB bağlantısı kuruldu.');
}
