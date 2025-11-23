import css from './header.module.scss';
import { Link } from 'react-router';
import { Container } from '../../../shared/ui';

export const Header = () => {
	return (
		<header className={css.header}>
			<Container>
				<nav className={css.nav}>
					<ul className={css.navList}>
						<li className={css.navItem}>
							<Link to="/">Home</Link>
						</li>
						<li className={css.navItem}>
							<Link to="/about">About</Link>
						</li>
						<li className={css.navItem}>
							<Link to="/contact">Contact</Link>
						</li>
					</ul>
				</nav>
			</Container>
		</header>
	);
};
