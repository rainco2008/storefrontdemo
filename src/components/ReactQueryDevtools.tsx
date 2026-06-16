import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools as Devtools } from '@tanstack/react-query-devtools';
import { queryClient } from '~/lib/query.ts';

export function ReactQueryDevtools() {
	return (
		<QueryClientProvider client={queryClient}>
			<Devtools />
		</QueryClientProvider>
	);
}
