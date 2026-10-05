import express from 'express';
import cors from 'cors';
import authenticationRouter from './features/authentication/authentication.routes.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', authenticationRouter);
export default app;
