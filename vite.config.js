import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base подставляется в CI (GitHub Pages отдаёт проект по пути /<repo>/).
// Для user/organization-страницы или корневого домена оставьте '/'.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
