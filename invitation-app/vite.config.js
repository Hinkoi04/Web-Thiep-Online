import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Cấu hình Vite middleware để dev server nhận diện đúng thư mục con
const mpaFallbackPlugin = () => ({
  name: 'mpa-fallback',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
        // Danh sách các thư mục thiệp
        const folders = ['Nhi', 'Hoa'];
        for (const folder of folders) {
          if (req.url.startsWith(`/${folder}`)) {
            req.url = `/${folder}/index.html`;
            break;
          }
        }
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    mpaFallbackPlugin()
  ],
  assetsInclude: ['**/*.JPG'],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nhi: resolve(__dirname, 'Nhi/index.html')
      }
    }
  }
})
