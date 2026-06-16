import type { GetImageResult } from 'astro';
import { useEffect, useRef, useState } from 'react';
import Card from '~/components/ui/Card.tsx';

interface ProductImageCarouselProps {
	productImages: GetImageResult[];
}

export function ProductImageCarousel(props: ProductImageCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const containerRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setCurrentIndex(Number(entry.target.getAttribute('data-index')));
					}
				}
			},
			{ root: containerRef.current, threshold: 0.5 },
		);

		for (const el of containerRef.current.querySelectorAll('li[data-index]')) {
			observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	const scrollToImage = (index: number) => {
		containerRef.current?.children[index]?.scrollIntoView({
			block: 'nearest',
			inline: 'center',
			behavior: 'smooth',
		});
	};

	return (
		<div className="relative">
			<ul
				ref={containerRef}
				className="relative flex w-full snap-x snap-mandatory gap-2 overflow-x-auto"
				aria-label="Product images"
			>
				{props.productImages.map((image, index) => (
					<li key={image.src} className="w-full shrink-0" data-index={index}>
						<Card className="flex aspect-square w-full items-center justify-center">
							<img
								{...image.attributes}
								alt=""
								src={image.src}
								srcSet={image.srcSet.attribute}
								loading={index === 0 ? 'eager' : 'lazy'}
								draggable={false}
								className="snap-center"
							/>
						</Card>
					</li>
				))}
			</ul>

			<div className="absolute inset-x-0 bottom-4 flex justify-center">
				<div className="flex gap-3 rounded-full bg-white p-1.5">
					{props.productImages.map((image, index) => (
						<div
							key={image.src}
							className="relative flex size-4 items-center justify-center rounded-full bg-white will-change-transform after:pointer-events-none after:block after:size-2 after:rounded-full after:bg-theme-base-400 after:transition-colors after:will-change-transform after:content-[''] hover:after:bg-theme-base-500 data-[current=true]:bg-black data-[current=true]:after:bg-white"
							data-current={index === currentIndex}
						>
							<button
								type="button"
								className="absolute left-1/2 top-1/2 size-11 -translate-x-1/2 -translate-y-1/2"
								aria-label={`Show image ${index + 1}`}
								onClick={() => scrollToImage(index)}
							>
								<span className="sr-only">Show image {index + 1}</span>
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
