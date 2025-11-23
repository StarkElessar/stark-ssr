import { App } from './app';

if (import.meta.env.DEV && globalThis.__devServer__) {
	console.log('Closing previous server instance...');
	globalThis.__devServer__.close();
	globalThis.__devServer__ = undefined;
}

const app = new App();
void app.bootstrap();

declare global {
	var __devServer__:
		| undefined
		| {
				close: () => Promise<void>;
		  };
}
