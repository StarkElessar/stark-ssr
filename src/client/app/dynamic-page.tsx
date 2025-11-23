import { Suspense } from 'react';
import { getComponent } from '@client/registry';

type DynamicPageProps = {
	componentName: string;
	data: any;
};

/**
 * DynamicPage Component
 * Renders the appropriate page component based on CMS data
 */
export const DynamicPage = ({ componentName, data }: DynamicPageProps) => {
	const Component = getComponent(componentName);

	if (Component) {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<Component {...data} />
			</Suspense>
		);
	}

	return (
		<div>
			<h1>Component Not Found</h1>
			<p>The component "{componentName}" is not registered.</p>
		</div>
	);
};
