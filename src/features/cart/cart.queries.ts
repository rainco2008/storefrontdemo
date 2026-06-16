import { queryOptions } from '@tanstack/react-query';
import { actions } from 'astro:actions';

export function cartQueryOptions() {
	return queryOptions({
		queryKey: ['cart'],
		queryFn: () => actions.cart.get.orThrow(),
		initialData: { items: [] },
	});
}
