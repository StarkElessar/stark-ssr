import { lazy } from 'react';

/**
 * Component Registry
 * Maps component names from CMS to actual React components
 */
export const COMPONENTS_REGISTRY = {
	home: lazy(() => import('./pages/home/page')),
	about: lazy(() => import('./pages/about/page')),
	contact: lazy(() => import('./pages/contact/page')),
};

/**
 * Get component by name from registry
 */
export const getComponent = (name: string) => {
	if (name in COMPONENTS_REGISTRY) {
		return COMPONENTS_REGISTRY[name as keyof typeof COMPONENTS_REGISTRY];
	}

	console.warn(`Component "${name}" not found in registry`);
	return null;
};
