import { join } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		resolve: {
			alias: {
				'@client': join(process.cwd(), 'src/client'),
				'@server': join(process.cwd(), 'src/server'),
				'@app-types': join(process.cwd(), 'src/types'),
			},
		},
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
				},
			},
		},
	};
});
