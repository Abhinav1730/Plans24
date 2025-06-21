// vite.config.js
export default {
  server: {
    proxy: {
      '/api/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/nominatim/, '')
      }
    }
  }
};

