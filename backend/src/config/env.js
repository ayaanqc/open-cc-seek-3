const rawPort = process.env.PORT ?? '4000';
const parsedPort = Number.parseInt(rawPort, 10);
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

export const env = {
  /** Host the Express server binds to. Use 0.0.0.0 to listen on all interfaces. */
  HOST: process.env.HOST ?? 'localhost',
  /** Server port. */
  PORT: Number.isNaN(parsedPort) ? 4000 : parsedPort,
  /** Runtime mode. */
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  /**
   * Comma-separated list of allowed origins, or "*" to reflect any origin.
   * Should match the frontend dev/production origin (e.g. http://localhost:5174).
   */
  CORS_ORIGIN: corsOrigin,
  /** Reserved for a future database integration. */
  DATABASE_URL: process.env.DATABASE_URL ?? '',
};
