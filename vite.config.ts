import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// El API de Scala no envía cabeceras CORS: en desarrollo y preview todo `/api`
// pasa por este proxy del mismo origen. Cambia EUROFIBO_API para apuntar a otro host.
const target = process.env.EUROFIBO_API ?? 'http://127.0.0.1:8484'
const proxy = { '/api': { target, changeOrigin: true } }

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { proxy },
  preview: { proxy },
})
