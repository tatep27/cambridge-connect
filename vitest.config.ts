import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    // Note: Tests require DATABASE_URL to be set to a PostgreSQL connection string
    // For local testing, you can use a PostgreSQL database or set up a test database
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});

