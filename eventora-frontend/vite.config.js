import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy removed: API routing is handled by VITE_API_URL and CORS is configured on the backend
  },
})
