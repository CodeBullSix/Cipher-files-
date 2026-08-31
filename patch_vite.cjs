const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

const replacement = `export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('d3')) {
                return 'vendor-d3';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {`;

content = content.replace('export default defineConfig(() => {\n  return {\n    plugins: [react(), tailwindcss()],\n    resolve: {\n      alias: {\n        \'@\': path.resolve(__dirname, \'.\'),\n      },\n    },\n    server: {', replacement);

fs.writeFileSync('vite.config.ts', content);
