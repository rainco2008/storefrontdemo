import type { GetImageResult } from 'astro';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Card from '~/components/ui/Card.tsx';
import { CheckIcon } from '~/components/ui/icons.tsx';

interface ProductImageSwitcherProps {
	productImages: GetImageResult[];
}

export function ProductImageSwitcher(props: ProductImageSwitcherProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const currentImage = props.productImages[currentImageIndex % props.productImages.length];
	if (!currentImage) throw new Error('Product image index out of bounds.');

	return (
		<div className="flex aspect-[10/9] items-stretch gap-2">
			<div className="relative flex flex-shrink-0 flex-col gap-[inherit] overflow-hidden will-change-scroll">
				{props.productImages.map((image, index) => (
					<button
						key={image.src}
						onClick={() => setCurrentImageIndex(index)}
						className={twMerge(
							'relative aspect-square h-20 flex-shrink-0 border border-theme-base-200 bg-theme-base-100 p-1 first:mt-auto last:mb-auto',
							index === currentImageIndex && 'border-theme-base-900',
						)}
						type="button"
					>
						<img
							{...image.attributes}
							alt=""
							src={image.src}
							srcSet={image.srcSet.attribute}
							className="h-full w-full object-cover"
						/>
						{index === currentImageIndex && (
							<CheckIcon
								className="pointer-events-none absolute right-1 top-1 size-4 text-theme-base-900"
								aria-hidden
							/>
						)}
					</button>
				))}
			</div>
			<Card className="aspect-square">
				<img
					{...currentImage.attributes}
					alt=""
					src={currentImage.src}
					srcSet={currentImage.srcSet.attribute}
					className="h-full w-full rounded-lg object-cover"
				/>
			</Card>
		</div>
	);
}
