import css from './home.module.scss';
import { Clicker } from './ui/clicker';

export default function Home() {
	return (
		<div className={css.container}>
			<h1>Home Page</h1>
			<Clicker />
		</div>
	);
}
