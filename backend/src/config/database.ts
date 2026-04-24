import mongoose from 'mongoose';
import { ENV } from './env';

function ensureMongoDbName(uri: string, defaultDb = 'tazekoy'): string {
  // If URI already includes a DB path (e.g. /tazekoy), keep it as-is.
  const hasDbName = /mongodb(?:\+srv)?:\/\/[^/]+\/[^?]/.test(uri);
  if (hasDbName) return uri;

  if (uri.includes('/?')) return uri.replace('/?', `/${defaultDb}?`);
  if (uri.endsWith('/')) return `${uri}${defaultDb}`;
  if (uri.includes('?')) return uri.replace('?', `/${defaultDb}?`);
  return `${uri}/${defaultDb}`;
}

export async function connectDB(): Promise<void> {
  const uri = ensureMongoDbName(ENV.MONGODB_URI);
  await mongoose.connect(uri);
  console.log('MongoDB bağlantısı kuruldu.');
}
