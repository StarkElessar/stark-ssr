import css from './clicker.module.scss';
import { useState } from 'react';

export const Clicker = () => {
	const [count, setCount] = useState(0);
	return (
		<button className={css.btn} onClick={() => setCount(count + 1)}>
			click {count}
		</button>
	);
};
