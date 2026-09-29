import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /<repo-name>/, so production builds need that base path.
  base: command === 'build' ? '/team-spectator/' : '/',
  plugins: [react()],
}))
