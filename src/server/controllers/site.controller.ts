import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Request, Response } from 'express';
import { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

import type { Data } from '@app-types';
import type { LayoutAssets } from '@app-types/assets';
import { RootLayout } from '@client/app';

import {
	createDevelopmentAssets,
	createProductionAssets,
	type Manifest,
	parseManifestToAssets,
} from '../utils/manifest-parser';

export class SiteController {
	private manifestPromise: Promise<Manifest>;

	constructor() {
		this.manifestPromise = readFile(
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
	}

	public index = async (req: Request, res: Response) => {
		const url = req.url;

		// Load CMS data
		const data = await readFile(join(process.cwd(), 'public', 'data.json'), 'utf-8');
		const parsedData: Data = JSON.parse(data);
		const page = parsedData.pages[url];

		if (!page) {
			res.status(404);
		}

		// Prepare assets based on environment
		let assets: LayoutAssets;

		if (import.meta.env.DEV) {
			// Development mode - inline styles with HMR
			const css = await readFile(join(process.cwd(), 'src/client/main.scss'), 'utf-8');
			assets = createDevelopmentAssets(css);
		} else {
			// Production mode - parse manifest and create production assets
			const manifest = await this.manifestPromise;
			// If page exists, try to load its specific assets, otherwise just load app assets
			const currentPageKey = page ? `src/client/pages/${page.component}/page.tsx` : undefined;
			const productionAssets = parseManifestToAssets(manifest, currentPageKey);
			assets = createProductionAssets(productionAssets);
		}

		const bootstrapModules =
			assets.mode === 'development'
				? [assets.development?.mainScript.src || '']
				: [assets.production?.mainScript.src || ''];

		// Render HTML
		const { pipe } = renderToPipeableStream(
			createElement(RootLayout, {
				routerData: Object.entries(parsedData.pages),
				assets,
				url,
			}),
			{
				bootstrapModules,
				onShellReady() {
					res.setHeader('content-type', 'text/html');
					pipe(res);
				},
				onShellError(error) {
					console.error('Shell execution failed', error);
					res.status(500).send('Internal Server Error');
				},
				onError(error) {
					console.error('Streaming error', error);
				},
			}
		);
	};
}
