import type { ReactNode } from 'react';
import { Drawer } from '~/components/ui/Drawer.tsx';
import { ArrowRightIcon } from '~/components/ui/icons.tsx';

export function ProductDetailDescriptionDialog(props: { title: string; children: ReactNode }) {
	return (
		<Drawer
			{...props}
			trigger={
				<div className="flex h-14 cursor-pointer list-none items-center justify-between border-y border-slate-300 px-3 font-bold text-slate-600">
					{props.title}
					<ArrowRightIcon className="!size-6" />
				</div>
			}
		/>
	);
}
