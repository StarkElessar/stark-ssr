import type { Page } from '@app-types';
import { Route, Routes } from 'react-router';
import NotFoundPage from '../pages/not-found/page';
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
							element={<DynamicPage componentName={pageData.component} data={pageData.data} />}
						/>
					);
				})}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
};
