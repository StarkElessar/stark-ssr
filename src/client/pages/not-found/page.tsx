import { Link } from 'react-router';
import { Container } from '@client/shared/ui';

export default function NotFoundPage() {
	return (
		<Container>
			<h1>404 - Page Not Found</h1>
			<p>The page you are looking for does not exist.</p>
			<Link to="/">Go back home</Link>
		</Container>
	);
}
