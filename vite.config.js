import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/ - Switching to PostCSS only
export default defineConfig({
  plugins: [
    react(),
  ],
})
