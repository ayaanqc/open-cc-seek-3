const rawPort = process.env.PORT ?? '4000';
const parsedPort = Number.parseInt(rawPort, 10);

export const env = {
  /** Server port. */
  PORT: Number.isNaN(parsedPort) ? 4000 : parsedPort,
  /** Runtime mode. */
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  /**
   * Comma-separated list of allowed origins, or "*" to reflect any origin.
   * The Vite dev server runs on 5173 by default.
   */
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  /**
   * Reserved for a future database integration. Wire these into a connection
   * pool (e.g. pg / mongoose) when persistence is added.
   */
  DATABASE_URL: process.env.DATABASE_URL ?? '',
};
