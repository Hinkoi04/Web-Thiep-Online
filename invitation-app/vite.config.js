import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  assetsInclude: ['**/*.JPG'],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nhi: resolve(__dirname, 'Nhi.html'),
        hoa: resolve(__dirname, 'Hoa.html'),
      }
    }
  }
})
