import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '', '');
  return {
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    plugins: [react()],
  }
})
