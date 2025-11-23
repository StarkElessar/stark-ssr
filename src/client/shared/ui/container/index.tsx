import cn from 'classnames';

import type { ReactNode } from 'react';
import css from './container.module.scss';

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
	return <div className={cn(css.container, className)}>{children}</div>;
};
