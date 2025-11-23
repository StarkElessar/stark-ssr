import { join } from 'node:path';
import compression from 'compression';
import express, { type Express } from 'express';
import type { ViteDevServer } from 'vite';

import { SiteController } from './controllers/site.controller';

export class App {
	public app: Express;
	public viteServer: ViteDevServer | null = null;
	private siteController: SiteController;

	constructor() {
		this.app = express();
		this.siteController = new SiteController();
	}

	public async bootstrap() {
		await this.initializeMiddlewares();
		this.initializeRoutes();
		this.listen();
	}

	private async initializeMiddlewares() {
		this.app.use(compression());
		this.app.use(express.json({ limit: '10mb' }));
		this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
		this.app.use(express.static(join(process.cwd(), 'public')));

		if (import.meta.env.DEV) {
			const vite = await import('vite');

			this.viteServer = await vite.createServer({
				configFile: join(process.cwd(), 'vite.client.config.ts'),
				server: { middlewareMode: true },
				appType: 'custom',
				base: '/',
			});

			this.app.use(this.viteServer.middlewares);
			console.log('Vite middleware initialized');
		} else {
			this.app.use(express.static(join(process.cwd(), '.output/client')));
		}
	}

	private initializeRoutes() {
		this.app.all(/.*/, this.siteController.index);
	}

	private listen() {
		const server = this.app.listen(3000, () => {
			console.log('Server running on port: http://localhost:3000');
		});

		if (import.meta.env.DEV) {
			globalThis.__devServer__ = {
				close: async () => {
					server.close();
					await this.viteServer?.close();
				},
			};
		}
	}
}
