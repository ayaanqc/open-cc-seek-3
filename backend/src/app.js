import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// Behind a reverse proxy (nginx, Heroku, Render) so req.ip reflects the client.
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST'],
  })
);

app.use(express.json({ limit: '20kb' }));

// Lightweight request log for non-test environments.
app.use((req, _res, next) => {
  if (env.NODE_ENV !== 'test') {
    console.log(`[opticore-api] ${req.method} ${req.originalUrl}`);
  }
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'opticore-api', uptime: Math.round(process.uptime()) });
});

app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
