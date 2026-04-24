import './config/env';
import app from './app';
import { connectDB } from './config/database';
import { ENV } from './config/env';

async function start() {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`TAZEKÖY Backend çalışıyor → http://localhost:${ENV.PORT}`);
  });
}

start().catch(err => {
  console.error('Başlatma hatası:', err);
  process.exit(1);
});
