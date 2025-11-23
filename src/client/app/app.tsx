import { Routes, Route } from 'react-router';

import type { Page } from '../../types';
import { DynamicPage } from './dynamic-page';
import { Header } from './ui/header';

export const App = ({ routerData }: { routerData: [string, Page][] }) => {
	return (
		<>
			<Header />
			<Routes>
				{routerData.map(([path, pageData]) => {
					return (
						<Route
							key={path}
							path={path}
							element={
								<DynamicPage
									componentName={pageData.component}
									data={pageData.data}
								/>
							}
						/>
					);
				})}
			</Routes>
		</>
	);
};
