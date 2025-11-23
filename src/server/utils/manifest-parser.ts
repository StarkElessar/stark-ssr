import type { LayoutAssets, ProductionAssets } from '../../types/assets';

/**
 * Vite manifest item structure
 */
export type ManifestItem = {
	file: string;
	src: string;
	name: string;
	isEntry?: boolean;
	isDynamicEntry?: boolean;
	css?: string[];
	imports?: string[];
	dynamicImports?: string[];
};

/**
 * Vite manifest structure
 */
export type Manifest = Record<string, ManifestItem>;

/**
 * Parses Vite manifest and extracts production assets
 */
export function parseManifestToAssets(
	manifest: Manifest,
	currentPageKey: string
): ProductionAssets {
	const mainTsxKey = 'src/client/main.tsx';
	const mainScssKey = 'src/client/main.scss';

	// Extract entries from manifest
	const mainTsx = manifest[mainTsxKey];
	const mainScss = manifest[mainScssKey];
	const currentPage = manifest[currentPageKey];

	return {
		// Global styles from main.scss
		globalStyles: mainScss
			? [
				{
					href: `/${mainScss.file}`,
					'data-purpose': 'global',
				},
			]
			: [],

		// App-level styles from main.tsx CSS imports
		appStyles:
			mainTsx?.css?.map((cssFile) => ({
				href: `/${cssFile}`,
				'data-purpose': 'layout',
			})) ?? [],

		// Page-specific styles
		pageStyles:
			currentPage?.css?.map((cssFile) => ({
				href: `/${cssFile}`,
				'data-purpose': 'page',
			})) ?? [],

		// Main application script
		mainScript: {
			src: `/${mainTsx.file}`,
			type: 'module',
		},
	};
}

/**
 * Creates assets structure for development mode
 */
export function createDevelopmentAssets(inlineStyles?: string): LayoutAssets {
	return {
		mode: 'development',
		development: {
			inlineStyles,
			mainScript: {
				src: './src/client/main.tsx',
				type: 'module',
			},
		},
	};
}

/**
 * Creates assets structure for production mode
 */
export function createProductionAssets(productionAssets: ProductionAssets): LayoutAssets {
	return {
		mode: 'production',
		production: productionAssets,
	};
}
