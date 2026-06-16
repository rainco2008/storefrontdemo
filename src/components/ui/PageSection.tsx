import type { HTMLAttributes, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type PageSectionProps = PropsWithChildren<HTMLAttributes<HTMLElement> & { class?: string }>;

export function PageSection({ children, className, class: astroClass, ...props }: PageSectionProps) {
	return (
		<section className={twMerge('flex flex-col gap-4', className, astroClass)} {...props}>
			{children}
		</section>
	);
}

export function PageHeading({
	children,
	className,
	class: astroClass,
	...props
}: PropsWithChildren<HTMLAttributes<HTMLHeadingElement> & { class?: string }>) {
	return (
		<h2 {...props} className={twMerge('text-2xl font-bold md:text-3xl', className, astroClass)}>
			{children}
		</h2>
	);
}
