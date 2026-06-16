import { QueryClientProvider, useMutation } from '@tanstack/react-query';
import { actions } from 'astro:actions';
import { useEffect, useMemo, useState } from 'react';
import type { LineItemInput, Product } from 'storefront:client';
import { Button } from '~/components/ui/Button.tsx';
import { NumberInput } from '~/components/ui/NumberInput.tsx';
import { CheckIcon } from '~/components/ui/icons.tsx';
import { queryClient } from '~/lib/query.ts';
import { CartStore } from './store.ts';

const MAX_QUANTITY = 20;

export function AddToCartForm(props: { product: Product }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AddToCartFormInner {...props} />
		</QueryClientProvider>
	);
}

function AddToCartFormInner(props: { product: Product }) {
	const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
	const [quantity, setQuantity] = useState(1);
	const [unpickedVariantVisible, setUnpickedVariantVisible] = useState(false);

	useEffect(() => {
		for (const input of document.querySelectorAll('[data-product-option]')) {
			if (!(input instanceof HTMLInputElement)) continue;
			if (!input.checked) continue;

			const { productOption, productOptionValue } = input.dataset;
			if (!productOption || !productOptionValue) continue;

			setSelectedOptions((options) => ({
				...options,
				[productOption]: productOptionValue,
			}));
		}
	}, []);

	const selectedVariant = props.product.variants.find((variant) =>
		Object.entries(selectedOptions).every(([key, value]) => variant.options[key] === value),
	);

	const mutation = useMutation(
		{
			mutationKey: ['cart', 'items', 'add', props.product.id],
			mutationFn: async (input: LineItemInput) => {
				return await actions.cart.addItems.orThrow(input);
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries();
				CartStore.openDrawer();
			},
		},
		queryClient,
	);

	const productOptionValues = useMemo(() => {
		const result = new Map<string, Set<string>>();
		for (const variant of props.product.variants) {
			for (const [option, value] of Object.entries(variant.options)) {
				const values = result.get(option) ?? new Set();
				values.add(value);
				result.set(option, values);
			}
		}
		return result;
	}, [props.product.variants]);

	const getVariantStock = (variant: Product['variants'][number] | undefined) =>
		Math.min(variant?.stock ?? 0, MAX_QUANTITY);

	return (
		<form
			className="grid gap-6"
			onSubmit={(event) => {
				event.preventDefault();
				if (selectedVariant) {
					mutation.mutate({ productVariantId: selectedVariant.id, quantity });
				} else {
					setUnpickedVariantVisible(true);
				}
			}}
		>
			{props.product.variants.length > 1 &&
				[...productOptionValues.entries()].map(([option, values]) => (
					<fieldset key={option}>
						<legend className="mb-1 text-slate-700">{option ?? 'Variants'}</legend>
						{unpickedVariantVisible && !selectedVariant && (
							<p role="alert" className="mb-2 text-sm text-red-400">
								Please make a selection.
							</p>
						)}
						<div className="flex flex-wrap gap-2">
							{[...values].map((value) => (
								<label
									key={value}
									className="flex h-11 min-w-11 items-center justify-center gap-1.5 border border-slate-300 bg-slate-100 px-3 text-center text-sm text-slate-600 transition hover:border-slate-500 has-[:checked]:border-slate-900 has-[:checked]:text-slate-900"
								>
									<input
										type="radio"
										value={value}
										className="peer sr-only"
										checked={selectedOptions[option] === value}
										onChange={() => {
											setSelectedOptions((options) => ({
												...options,
												[option]: value,
											}));
										}}
										data-product-option={option}
										data-product-option-value={value}
									/>
									<div>{value}</div>
									<CheckIcon className="hidden size-4 peer-checked:block" />
								</label>
							))}
						</div>
					</fieldset>
				))}

			<div className="mb-2">
				<label htmlFor="quantity" className="mb-2 block text-slate-700">
					Quantity
				</label>
				<NumberInput id="quantity" min={1} value={quantity} setValue={setQuantity} />
			</div>
			<div className="sticky bottom-4 grid gap-2">
				{Object.keys(selectedOptions).length < productOptionValues.size ? (
					<p className="h-12">Choose a style.</p>
				) : selectedVariant == null ? (
					<p className="h-12">This style is unavailable.</p>
				) : selectedVariant.stock === 0 ? (
					<p className="h-12">This style is out of stock.</p>
				) : quantity > getVariantStock(selectedVariant) ? (
					<p className="h-12">Only {getVariantStock(selectedVariant)} left in stock.</p>
				) : (
					<Button type="submit" pending={mutation.isPending}>
						Add to cart
					</Button>
				)}
			</div>

			{mutation.isError && (
				<aside className="text-red-500">Sorry, something went wrong. Please try again.</aside>
			)}
		</form>
	);
}
