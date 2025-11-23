import type { Page } from '@app-types';
import type { LayoutAssets } from '@app-types/assets';
import { StaticRouter } from 'react-router';
import { App } from './app';
import { AssetsHead, AssetsScripts } from './components/assets-head';

type RootLayoutProps = {
	/** Assets configuration for styles and scripts */
	assets: LayoutAssets;
	/** Router data for dynamic routes */
	routerData: [string, Page][];
	/** Current URL for SSR */
	url: string;
};

/**
 * Root HTML layout component for SSR
 *
 * Responsibilities:
 * - Renders complete HTML structure
 * - Injects assets (styles and scripts) in optimal order
 * - Handles both development and production modes
 * - Sets up router with initial URL
 */
export default function RootLayout({ routerData, url, assets }: RootLayoutProps) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Dynamic Routing</title>

				{/* All styles are rendered here in optimal order */}
				<AssetsHead assets={assets} />
			</head>
			<body>
				<div id="__root" className="wrapper">
					<StaticRouter location={url}>
						<App routerData={routerData} />
					</StaticRouter>
				</div>

				{/* Scripts are loaded at the end for better performance */}
				<AssetsScripts assets={assets} />
			</body>
		</html>
	);
}
