import express from 'express';
import cors from 'cors';
import authenticationRouter from './authentication.routes.js';

const allowedOrigins = new Set([
  process.env.FRONTEND_ORIGIN,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
].filter(Boolean));

const app = express();
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', authenticationRouter);
export default app;
