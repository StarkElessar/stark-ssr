/**
 * Asset management types for SSR
 */

/**
 * A single stylesheet resource
 */
export type StyleAsset = {
	href: string;
	/** Optional attribute for identifying the purpose of the stylesheet */
	'data-purpose'?: 'global' | 'layout' | 'page' | 'component';
};

/**
 * A single script resource
 */
export type ScriptAsset = {
	src: string;
	type?: 'module' | 'text/javascript';
	async?: boolean;
	defer?: boolean;
};

/**
 * Collection of production assets from Vite manifest
 */
export type ProductionAssets = {
	/** Global stylesheets (e.g., from main.scss) */
	globalStyles: StyleAsset[];
	/** App-level stylesheets (e.g., from main.tsx CSS imports) */
	appStyles: StyleAsset[];
	/** Page-specific stylesheets */
	pageStyles: StyleAsset[];
	/** Main application script */
	mainScript: ScriptAsset;
};

/**
 * Development mode assets (mostly served by Vite dev server)
 */
export type DevelopmentAssets = {
	/** Inline styles for development */
	inlineStyles?: string;
	/** Main entry point for Vite HMR */
	mainScript: ScriptAsset;
};

/**
 * Unified assets structure for both dev and prod
 */
export type LayoutAssets = {
	mode: 'development' | 'production';
	production?: ProductionAssets;
	development?: DevelopmentAssets;
};
