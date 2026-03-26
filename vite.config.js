import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/dynamic-layout-demo/',
  plugins: [react()],
  server: {
    port: 7000,
  },
})
