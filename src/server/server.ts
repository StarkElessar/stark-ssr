import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import express from 'express';
import type { ViteDevServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import type { Data } from '../types';
import { RootLayout } from '../client/app';

type ManifestItem = {
	file: string;
	src: string;
	name: string;
	isEntry?: boolean;
	isDynamicEntry?: boolean;
	names?: string[];
	dynamicImports?: string[];
	css?: string[];
	imports?: string[];
};

type Manifest = Record<string, ManifestItem>;

if (import.meta.env.DEV && globalThis.__devServer__) {
	console.log('Closing previous server instance...');
	globalThis.__devServer__.close();
	globalThis.__devServer__ = undefined;
}

const createServer = async () => {
	const app = express();

	const manifestPromise = readFile(
		join(process.cwd(), '.output/client/.vite/manifest.json'),
		'utf-8'
	)
		.then<Manifest>((manifestContent) => {
			return JSON.parse(manifestContent);
		})
		.catch<Manifest>((error) => {
			console.warn('Manifest not found, using default paths ', error);
			return {};
		});

	let viteServer: ViteDevServer | null = null;

	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ extended: true, limit: '10mb' }));
	app.use(express.static(join(process.cwd(), 'public')));

	if (import.meta.env.DEV) {
		const vite = await import('vite');

		viteServer = await vite.createServer({
			configFile: join(process.cwd(), 'vite.client.config.ts'),
			server: { middlewareMode: true },
			appType: 'custom',
			base: '/',
		});

		app.use(viteServer.middlewares);
		console.log('Vite middleware initialized');
	} else {
		app.use(express.static(join(process.cwd(), '.output/client')));
	}

	app.get('*all', async (req, res) => {
		const url = req.url;

		const data = await readFile(join(process.cwd(), 'public', 'data.json'), 'utf-8');
		const parsedData: Data = JSON.parse(data);
		const page = parsedData.pages[url];

		if (!page) {
			return res.status(404).send('Not Found');
		}

		const manifest = await manifestPromise;
		const currentPageKey = `src/client/pages/${page.component}/page.tsx`;

		const html = renderToString(
			createElement(RootLayout, {
				routerData: Object.entries(parsedData.pages),
				layoutAssets: {
					script: import.meta.env.DEV
						? './src/client/main.tsx'
						: `/${manifest['src/client/main.tsx'].file}`,
					style: import.meta.env.PROD ? `/${manifest['src/client/main.scss'].file}` : '',
				},
				currentPageAssets: {
					style: import.meta.env.PROD ? (manifest[currentPageKey].css ?? []) : [],
				},
				url,
			})
		);

		res.send('<!DOCTYPE html>' + html);
	});

	return { app, viteServer };
};

createServer().then((props) => {
	const server = props.app.listen(3000, () => {
		console.log('Server running on port: http://localhost:3000');
	});

	if (import.meta.env.DEV) {
		globalThis.__devServer__ = {
			close: async () => {
				server.close();
				await props.viteServer?.close();
			},
		};
	}
});

declare global {
	var __devServer__:
		| {
				close: () => Promise<void>;
		  }
		| undefined;
}
