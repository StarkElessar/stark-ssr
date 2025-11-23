import { join } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
	return {
		plugins: [react()],
		build: {
			outDir: '.output/client',
			ssr: false,
			copyPublicDir: false,
			manifest: true,
			rollupOptions: {
				input: {
					app: join(process.cwd(), 'src/client/main.tsx'),
					main: join(process.cwd(), 'src/client/main.scss'),
				},
				output: {
					format: 'es',
					entryFileNames: '[name]-[hash].js',
					chunkFileNames: '[name]-[hash].js',
					assetFileNames: '[name]-[hash][extname]',
				},
			},
			minify: 'esbuild',
			sourcemap: true,
		},
	};
});
