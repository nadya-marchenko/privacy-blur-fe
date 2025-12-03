import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // If your repository name on GitHub is different, update the base path accordingly:
  // e.g. base: '/your-repo-name/'
  base: '/privacy-blur-fe/',
  plugins: [react()],
})
