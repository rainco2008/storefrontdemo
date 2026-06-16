import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { card } from '~/styles';

type Props = HTMLAttributes<HTMLDivElement> & {
	class?: string;
};

export default function Card({ className, class: astroClass, children, ...props }: Props) {
	return (
		<div {...props} className={twMerge(card(), className, astroClass)}>
			{children}
		</div>
	);
}
