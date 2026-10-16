import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server port and proxy target are driven by environment variables so
// you can change them without editing this file.
//   VITE_PORT=5174            -> dev server port
//   VITE_PROXY_TARGET=http://localhost:4000 -> backend origin
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  const port = Number.parseInt(env.VITE_PORT ?? '5173', 10) || 5173;
  const proxyTarget = env.VITE_PROXY_TARGET ?? 'http://localhost:4000';

  return {
    plugins: [react()],
    server: {
      port,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
