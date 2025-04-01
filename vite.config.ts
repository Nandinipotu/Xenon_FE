import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),               // Alias for src folder
      'api': path.resolve(__dirname, './src/api'),         // Alias for API folder
      'store': path.resolve(__dirname, './src/store'),      // Alias for store folder
      'routes': path.resolve(__dirname, './src/routes')      // Alias for store folder
    }
  }
});
