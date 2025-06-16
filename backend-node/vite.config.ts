import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'dist',
    target: 'node20',
    rollupOptions: {
      input: 'src/index.ts',
      external: ['express', 'node-fetch', 'cors']
    }
  }
});
