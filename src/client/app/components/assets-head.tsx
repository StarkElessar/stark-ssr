import type { LayoutAssets, StyleAsset } from '@app-types/assets';

/**
 * Renders stylesheet link tags
 */
function StylesheetLinks({ styles }: { styles: StyleAsset[] }) {
	if (styles.length === 0) return null;

	return (
		<>
			{styles.map((style, index) => (
				<link
					key={`style-${style['data-purpose']}-${index}`}
					rel="stylesheet"
					href={style.href}
					data-purpose={style['data-purpose']}
				/>
			))}
		</>
	);
}

/**
 * Renders inline styles for development mode
 */
function InlineStyles({ css }: { css: string }) {
	// biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for SSR inline styles
	return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/**
 * Renders React Refresh runtime for HMR in development
 */
function ReactRefreshRuntime() {
	return (
		<script
			type="module"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for React Refresh runtime
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
	);
}

/**
 * Renders production stylesheets in optimal loading order:
 * 1. Global styles (main.scss)
 * 2. App-level styles (from main.tsx)
 * 3. Page-specific styles
 */
function ProductionStyles({ assets }: { assets: LayoutAssets }) {
	if (assets.mode !== 'production' || !assets.production) return null;

	const { globalStyles, appStyles, pageStyles } = assets.production;

	return (
		<>
			<StylesheetLinks styles={globalStyles} />
			<StylesheetLinks styles={appStyles} />
			<StylesheetLinks styles={pageStyles} />
		</>
	);
}

/**
 * Renders development styles and HMR setup
 */
function DevelopmentStyles({ assets }: { assets: LayoutAssets }) {
	if (assets.mode !== 'development' || !assets.development) return null;

	const { inlineStyles } = assets.development;

	return (
		<>
			{inlineStyles && <InlineStyles css={inlineStyles} />}
			<ReactRefreshRuntime />
		</>
	);
}

/**
 * Renders the main application script
 */
function MainScript({ assets }: { assets: LayoutAssets }) {
	const script =
		assets.mode === 'production' ? assets.production?.mainScript : assets.development?.mainScript;

	if (!script) return null;

	return (
		<script
			type={script.type || 'module'}
			src={script.src}
			async={script.async}
			defer={script.defer}
		/>
	);
}

/**
 * Main component that renders all assets in the document head
 * Handles both development and production modes
 */
export function AssetsHead({ assets }: { assets: LayoutAssets }) {
	return (
		<>
			{/* Styles - order matters for CSS specificity */}
			<ProductionStyles assets={assets} />
			<DevelopmentStyles assets={assets} />
		</>
	);
}

/**
 * Renders scripts at the end of body
 */
export function AssetsScripts({ assets }: { assets: LayoutAssets }) {
	return <MainScript assets={assets} />;
}
