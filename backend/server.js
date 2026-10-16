import 'dotenv/config';
import app from './src/app.js';
import { env } from './src/config/env.js';

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`[opticore-api] listening on http://${env.HOST}:${env.PORT}`);
  console.log(`[opticore-api] environment: ${env.NODE_ENV}`);
});

const shutdown = (signal) => {
  console.log(`\n[opticore-api] received ${signal}, closing server...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
