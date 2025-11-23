import { Container } from '@client/shared/ui';
import css from './home.module.scss';
import { Clicker } from './ui/clicker';

export default function Home() {
	return (
		<Container>
			<h1 className={css.title}>Home Page</h1>
			<Clicker />
		</Container>
	);
}
