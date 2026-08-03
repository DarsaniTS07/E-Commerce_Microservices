import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward all API calls to AWS API Gateway — avoids CORS in local dev
      '/events': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/cart': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/carts': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/orders': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/payments': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/notifications': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/inventory': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/waitlist': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/users': {
        target: 'https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
