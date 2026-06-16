import type { ComponentProps, ElementType, MouseEventHandler, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { LoaderIcon } from './icons.tsx';

interface Props extends ComponentProps<'button'> {
	pending?: boolean;
}

export function Button({ pending, children, className, disabled, type = 'button', ...props }: Props) {
	return (
		<button
			{...props}
			type={type}
			disabled={disabled}
			className={twMerge(
				'flex h-12 items-center justify-center gap-3 bg-theme-base-900 px-4 text-sm font-semibold uppercase text-white transition',
				className,
				(disabled || pending) && 'opacity-50',
				!disabled && 'hover:bg-theme-base-600',
			)}
		>
			{pending ? <LoaderIcon className="size-5 animate-spin" /> : children}
		</button>
	);
}

interface SquareIconButtonProps {
	as?: 'button' | 'div';
	type?: 'button' | 'submit' | 'reset';
	className?: string;
	class?: string;
	children?: ReactNode;
	theme?: 'light' | 'dark';
	onClick?: MouseEventHandler<HTMLElement>;
	disabled?: boolean;
}

export function SquareIconButton({
	as = 'button',
	type = 'button',
	className,
	class: astroClass,
	children,
	theme = 'light',
	onClick,
	disabled,
}: SquareIconButtonProps) {
	const Component = as as ElementType;
	const buttonProps = as === 'button' ? { type, disabled } : { role: 'button', tabIndex: 0 };

	return (
		<Component
			{...buttonProps}
			onClick={onClick}
			className={twMerge(
				'size-9 border transition grid-center data-[icon]:*:size-6',
				theme === 'light' &&
					'bg-theme-base-100 border-theme-base-200 text-theme-base-900 hover:enabled:border-theme-base-400 hover:enabled:bg-theme-base-300 disabled:text-theme-base-400',
				theme === 'dark' &&
					'bg-theme-base-800 border-theme-base-700 text-theme-base-100 hover:enabled:border-theme-base-700 hover:enabled:bg-theme-base-800',
				className,
				astroClass,
			)}
		>
			{children}
		</Component>
	);
}
