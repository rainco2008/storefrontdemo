import { twMerge } from 'tailwind-merge';
import { formatProductPrice } from '~/lib/currency.ts';
import type { Product } from '../cart/cart.ts';

type Props = {
	price: Product['price'];
	discount: Product['discount'];
	className?: string;
	class?: string;
};

export function ProductPrice(props: Props) {
	return (
		<span className={twMerge('flex gap-2 font-medium', props.className, props.class)}>
			{formatProductPrice(props.price - props.discount)}
			{props.discount > 0 && (
				<span className="text-slate-400 line-through">{formatProductPrice(props.price)}</span>
			)}
		</span>
	);
}
