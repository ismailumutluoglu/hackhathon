import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { ENV } from './config/env';

import authRoutes     from './routes/auth.routes';
import userRoutes     from './routes/user.routes';
import productRoutes  from './routes/product.routes';
import producerRoutes from './routes/producer.routes';
import orderRoutes    from './routes/order.routes';
import aiRoutes       from './routes/ai.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const aiLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: { success: false, message: 'Saatlik AI istek limitine ulaştınız.' } });

app.use('/api/', limiter);
app.use('/api/ai', aiLimiter);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', env: ENV.NODE_ENV }));

app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/producers', producerRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/ai',        aiRoutes);

app.use(errorMiddleware);

export default app;
