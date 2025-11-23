import css from './container.module.scss';

import { ReactNode } from 'react';
import cn from 'classnames';

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
	return <div className={cn(css.container, className)}>{children}</div>;
};
