import { BrowserRouter } from 'react-router';
import { hydrateRoot } from 'react-dom/client';

import { Data } from '@app-types';
import { App } from './app';

const bootstrap = async () => {
	const container = document.getElementById('__root')!;
	const data: Data | null = await fetch('/data.json')
		.then((res) => res.json())
		.catch(() => null);

	if (data) {
		hydrateRoot(
			container,
			<BrowserRouter>
				<App routerData={Object.entries(data.pages)} />
			</BrowserRouter>
		);
	}
};

void bootstrap();
