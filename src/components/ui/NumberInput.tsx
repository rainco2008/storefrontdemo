import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { clamp } from '~/lib/util.ts';
import { MinusIcon, PlusIcon } from './icons.tsx';

export function NumberInput(
	props: InputHTMLAttributes<HTMLInputElement> & {
		min?: number;
		max?: number;
		value: number;
		setValue: (value: number) => void;
	},
) {
	const min = props.min ?? 0;
	const max = props.max ?? Number.POSITIVE_INFINITY;

	const update = (newValueInput: number) => {
		const newValue = clamp(Number.isNaN(newValueInput) ? min : newValueInput, min, max);
		if (newValue !== props.value) {
			props.setValue(newValue);
		}
	};

	return (
		<div className="flex h-11 w-fit items-stretch divide-x divide-slate-300 border border-slate-300 bg-slate-100 text-slate-600">
			<NumberInputButton
				icon={<MinusIcon className="size-4" />}
				onClick={() => update(props.value - 1)}
				disabled={props.disabled ?? props.value <= min}
			>
				Decrement
			</NumberInputButton>
			<input
				{...props}
				min={min}
				max={max}
				type="number"
				className="w-12 bg-transparent bg-white p-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				value={props.value}
				onInput={(event) => update(event.currentTarget.valueAsNumber)}
			/>
			<NumberInputButton
				icon={<PlusIcon className="size-4" />}
				onClick={() => update(props.value + 1)}
				disabled={props.disabled ?? props.value >= max}
			>
				Increment
			</NumberInputButton>
		</div>
	);
}

function NumberInputButton({
	icon,
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	icon: ReactNode;
}) {
	return (
		<button
			type="button"
			className="flex aspect-square h-full items-center justify-center transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
			{...props}
		>
			<span className="sr-only">{children}</span>
			{icon}
		</button>
	);
}
