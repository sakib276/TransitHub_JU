import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for the TransitHub JU frontend.
 *
 * @returns {import('vite').UserConfig} Vite configuration object.
 */
export default defineConfig({
  plugins: [react()],
});