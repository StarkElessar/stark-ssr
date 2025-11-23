import css from '../main.scss?raw';
import { StaticRouter } from 'react-router';

import type { Page } from '../../types';
import { App } from './app';

type RootLayoutProps = {
	currentPageAssets: {
		style: string[];
	};
	layoutAssets: {
		script: string;
		style: string;
	};
	routerData: [string, Page][];
	url: string;
};

export default function RootLayout({
	routerData,
	url,
	layoutAssets,
	currentPageAssets,
}: RootLayoutProps) {
	return (
		<html>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Dynamic Routing</title>

				{import.meta.env.PROD && (
					<>
						<link rel="stylesheet" href={layoutAssets.style} />
						{currentPageAssets.style.map((path, index) => (
							<link rel="stylesheet" href={'/' + path} key={index} />
						))}
					</>
				)}

				{import.meta.env.DEV && (
					<>
						<style>{css}</style>
						<script
							type="module"
							dangerouslySetInnerHTML={{
								__html: `
								import RefreshRuntime from '/@react-refresh';
								RefreshRuntime.injectIntoGlobalHook(window);
								window.$RefreshReg$ = () => {};
								window.$RefreshSig$ = () => (type) => type;
								window.__vite_plugin_react_preamble_installed__ = true;
							`,
							}}
						/>
					</>
				)}
			</head>
			<body>
				<div id="__root" className="wrapper">
					<StaticRouter location={url}>
						<App routerData={routerData} />
					</StaticRouter>
				</div>
				<script type="module" src={layoutAssets.script} />
			</body>
		</html>
	);
}
