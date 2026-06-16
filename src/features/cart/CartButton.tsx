import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import { SquareIconButton } from '~/components/ui/Button.tsx';
import { CartIcon } from '~/components/ui/icons.tsx';
import { cartQueryOptions } from '~/features/cart/cart.queries.ts';
import { queryClient } from '~/lib/query.ts';
import type { StrictOmit } from '~/lib/types.ts';

type Props = StrictOmit<ComponentProps<typeof SquareIconButton>, 'children'>;

export function CartButton(props: Props) {
	return (
		<QueryClientProvider client={queryClient}>
			<CartButtonInner {...props} />
		</QueryClientProvider>
	);
}

function CartButtonInner(props: Props) {
	const query = useQuery(cartQueryOptions());
	const itemCount = query.data.items.reduce((total, item) => total + item.quantity, 0);

	return (
		<div className="relative">
			<SquareIconButton {...props}>
				<CartIcon className="size-5" />
				<span className="sr-only">Show cart</span>
			</SquareIconButton>
			<div className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3">
				<div
					role="status"
					data-visible={itemCount > 0 || undefined}
					className="grid size-4 place-content-center rounded-full bg-slate-700 text-xs text-white opacity-0 transition-opacity data-[visible]:opacity-100"
				>
					{itemCount} <span className="sr-only">items added</span>
				</div>
			</div>
		</div>
	);
}
