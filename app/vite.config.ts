import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 5174 so it can run alongside the data-explorer in ../frontend (5173)
  server: { port: 5174 },
})
