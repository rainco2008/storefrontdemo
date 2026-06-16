import { useMutation } from '@tanstack/react-query';
import { actions } from 'astro:actions';
import { NumberInput } from '~/components/ui/NumberInput.tsx';
import { TrashIcon } from '~/components/ui/icons.tsx';
import {
	type LineItem,
	emptyCart,
	removeItemFromCart,
	updateCartItemQuantity,
} from '~/features/cart/cart.ts';
import { ProductPrice } from '~/features/product/ProductPrice.tsx';
import { queryClient } from '~/lib/query.ts';
import { productPath } from '~/paths.ts';
import { card } from '~/styles.ts';
import { cartQueryOptions } from './cart.queries.ts';

export function CartItem(props: { item: LineItem; className?: string; class?: string }) {
	const updateMutation = useMutation(
		{
			mutationKey: ['cart', 'items', 'update', props.item.id],
			mutationFn: async (input: { quantity: number }) => {
				await actions.cart.updateItem.orThrow({
					id: props.item.id,
					quantity: input.quantity,
				});
			},
			onMutate: async (variables) => {
				await queryClient.cancelQueries({
					queryKey: cartQueryOptions().queryKey,
				});
				queryClient.setQueryData(cartQueryOptions().queryKey, (cart = emptyCart()) =>
					updateCartItemQuantity(cart, props.item.id, variables.quantity),
				);
			},
		},
		queryClient,
	);

	const deleteMutation = useMutation(
		{
			mutationKey: ['cart', 'items', 'delete', props.item.id],
			mutationFn: async () => {
				await actions.cart.deleteItem.orThrow({
					id: props.item.id,
				});
			},
			onMutate: async () => {
				await queryClient.cancelQueries({
					queryKey: cartQueryOptions().queryKey,
				});
				queryClient.setQueryData(cartQueryOptions().queryKey, (cart = emptyCart()) =>
					removeItemFromCart(cart, props.item.id),
				);
			},
		},
		queryClient,
	);

	if (!deleteMutation.isIdle) return null;

	return (
		<div className={`flex items-start gap-8 ${props.className ?? props.class ?? ''}`}>
			<a
				href={productPath(props.item.productVariant.product.slug)}
				className={card({ className: 'w-32' })}
			>
				<img
					src={props.item.productVariant.product.imageUrl}
					width={128}
					height={128}
					alt={props.item.productVariant.product.name}
				/>
			</a>

			<div className="flex flex-1 flex-col">
				<p className="mt-auto py-2 text-lg/none font-medium text-slate-700">
					{props.item.productVariant.product.name}
				</p>

				{Object.values(props.item.productVariant.options).length > 0 && (
					<p className="-mt-[3px] font-medium text-slate-500">
						{Object.values(props.item.productVariant.options).join(' • ')}
					</p>
				)}

				<p className="-translate-y-0.5 py-2 font-medium leading-none text-slate-600">
					<ProductPrice
						price={props.item.productVariant.product.price}
						discount={props.item.productVariant.product.discount}
					/>
				</p>

				<NumberInput
					min={0}
					max={20}
					value={updateMutation.variables?.quantity ?? props.item.quantity}
					setValue={(value) => {
						if (value > 0) {
							updateMutation.mutate({ quantity: value });
						} else {
							deleteMutation.mutate();
						}
					}}
				/>
			</div>

			<button
				type="button"
				className="-my-2 self-end p-2 text-slate-600 hover:text-slate-700"
				onClick={() => deleteMutation.mutate()}
			>
				<TrashIcon className="size-6" />
				<span className="sr-only">Remove item</span>
			</button>
		</div>
	);
}
