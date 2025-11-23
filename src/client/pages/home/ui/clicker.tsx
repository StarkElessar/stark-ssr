import { useState } from 'react';
import css from './clicker.module.scss';

export const Clicker = () => {
	const [count, setCount] = useState(0);
	return (
		<button type="button" className={css.btn} onClick={() => setCount(count + 1)}>
			click {count}
		</button>
	);
};
