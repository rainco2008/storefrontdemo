import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Button } from '~/components/ui/Button.tsx';
import { Drawer } from '~/components/ui/Drawer.tsx';
import { CartSummary } from '~/features/cart/CartSummary.tsx';
import { cartQueryOptions } from '~/features/cart/cart.queries.ts';
import { queryClient } from '~/lib/query.ts';
import { CartButton } from './CartButton.tsx';
import { CartStore, useCartDrawerOpen } from './store.ts';

export function CartDrawer() {
	return (
		<QueryClientProvider client={queryClient}>
			<CartDrawerInner />
		</QueryClientProvider>
	);
}

function CartDrawerInner() {
	const query = useQuery(cartQueryOptions());
	const drawerOpen = useCartDrawerOpen();

	return (
		<Drawer
			title="Cart"
			open={drawerOpen}
			onOpenChange={CartStore.setDrawerOpen}
			trigger={<CartButton as="div" />}
		>
			<div className="flex h-full flex-col py-4">
				<CartSummary />
				{query.data.items.length > 0 && (
					<form method="post" action="/api/checkout" className="contents" data-astro-reload>
						<Button type="submit">Checkout</Button>
					</form>
				)}
				<aside className="mt-3 text-balance text-center text-sm font-medium text-theme-base-500">
					Discount and shipping will be calculated on the checkout page.
				</aside>
			</div>
		</Drawer>
	);
}
