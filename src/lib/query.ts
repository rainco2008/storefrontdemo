import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onSettled: async () => {
				await queryClient.invalidateQueries();
			},
			onError: (error) => {
				console.error(error);
			},
		},
	},
});
