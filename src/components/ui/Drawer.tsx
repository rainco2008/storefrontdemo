import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { CloseIcon } from './icons.tsx';

export function Drawer(props: {
	title: string;
	trigger?: ReactNode;
	children: ReactNode;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const open = props.open ?? props.defaultOpen ?? false;
	const setOpen = (nextOpen: boolean) => props.onOpenChange?.(nextOpen);
	const trigger =
		isValidElement(props.trigger)
			? cloneElement(props.trigger as ReactElement<{ onClick?: () => void }>, {
					onClick: () => setOpen(true),
				})
			: props.trigger;

	return (
		<>
			{trigger}
			{open && (
				<div role="dialog" aria-modal="true" aria-label={props.title}>
					<button
						type="button"
						className="fixed inset-0 bg-black/25 animate-in fade-in"
						aria-label="Close cart overlay"
						onClick={() => setOpen(false)}
					/>
					<section className="fixed inset-y-0 right-0 flex w-[min(560px,100vw)] flex-col bg-white ease-out animate-in fade-in slide-in-from-right-4">
						<header className="flex h-14 flex-row items-center justify-between px-4">
							<h2 className="text-2xl font-bold">{props.title}</h2>
							<button
								type="button"
								className="size-9 border border-slate-300 bg-slate-100 text-slate-600 transition grid-center hover:border-slate-500"
								onClick={() => setOpen(false)}
							>
								<CloseIcon className="size-5" />
								<span className="sr-only">Dismiss</span>
							</button>
						</header>
						<div className="border-b border-gray-300" />
						<main className="flex-1 overflow-y-auto px-6">{props.children}</main>
					</section>
				</div>
			)}
		</>
	);
}
