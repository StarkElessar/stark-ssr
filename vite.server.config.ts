import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		build: {
			outDir: '.output/server',
			copyPublicDir: false,
			ssr: true,
			rollupOptions: {
				input: {
					server: 'src/server/server.ts',
				},
				output: {
					entryFileNames: 'server.mjs',
					chunkFileNames: 'chunk-[hash].mjs',
					assetFileNames: 'assets/[name].[hash][extname]',
				}
			}
		}
	}
});
