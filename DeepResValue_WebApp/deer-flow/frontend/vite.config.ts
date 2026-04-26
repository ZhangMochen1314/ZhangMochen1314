import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    watch: {
      ignored: [
        '**/StatsPAI/**',
        '**/.venv/**'
      ]
    },
    proxy: {
      '/auth': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/api/langgraph': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/langgraph/, '/api'),
        timeout: 600000,
        proxyTimeout: 600000
      },
      '/api/skills': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        timeout: 600000,
        proxyTimeout: 600000
      },
      '/api/threads': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        timeout: 600000,
        proxyTimeout: 600000
      }
    }
  }
})
