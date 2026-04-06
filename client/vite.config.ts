import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,        // <-- allows access from any host
    port: 5173,        // <-- make sure this matches your dev server port
    allowedHosts: ['.loca.lt'],
    strictPort: false,
    origin: 'http://localhost:5173',
  }
})
