import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

// Danh sách các thư mục thiệp (MPA entry points)
const MPA_FOLDERS = ['Nhi', 'Hoa', 'HoangYen'];

// Plugin MPA: serve đúng index.html cho từng thiệp
const mpaFallbackPlugin = () => ({
  name: 'mpa-fallback',
  enforce: 'pre',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      const accept = req.headers.accept || '';
      if (!accept.includes('text/html')) return next();

      const url = req.url.split('?')[0]; // bỏ query string

      for (const folder of MPA_FOLDERS) {
        if (url === `/${folder}` || url.startsWith(`/${folder}/`)) {
          const htmlPath = resolve(__dirname, folder, 'index.html');
          if (fs.existsSync(htmlPath)) {
            // Đọc HTML, cho Vite transform (inject HMR client, etc.)
            server.transformIndexHtml(url, fs.readFileSync(htmlPath, 'utf-8'))
              .then((html) => {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.statusCode = 200;
                res.end(html);
              })
              .catch(next);
            return; // dừng, không gọi next()
          }
          break;
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
        nhi: resolve(__dirname, 'Nhi/index.html'),
        hoangyen: resolve(__dirname, 'HoangYen/index.html')
      }
    }
  }
})
