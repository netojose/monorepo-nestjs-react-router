import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true
  },
  server: {
    watch: {
      // Bind-mounted volumes (Docker dev) don't always propagate native fs events reliably.
      usePolling: process.env.VITE_WATCH_POLL === 'true'
    }
  }
})
