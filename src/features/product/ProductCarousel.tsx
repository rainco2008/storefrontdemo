import { type PropsWithChildren, useRef, useState } from 'react';
import { SquareIconButton } from '~/components/ui/Button.tsx';
import { ArrowLeftIcon, ArrowRightIcon } from '~/components/ui/icons.tsx';
import { PageHeading, PageSection } from '~/components/ui/PageSection.tsx';

export const MEASURED_ITEM_ID = 'measured-li';
export const GAP = 16;
const HEADING_ID = 'product-carousel-heading';

export default function ProductCarouselSection(
	props: PropsWithChildren<{
		heading: string;
	}>,
) {
	const list = useRef<HTMLDivElement | null>(null);
	const [scrollStatus, setScrollStatus] = useState<'start' | 'end' | 'middle'>('start');

	const scroll = (delta: number) => {
		if (!list.current) return;

		const item = document.getElementById(MEASURED_ITEM_ID);
		const itemWidth = (item?.getBoundingClientRect().width ?? 300) + GAP;
		const containerWidth = list.current.getBoundingClientRect().width;
		const numCardsToScrollBy = Math.max(Math.floor(containerWidth / itemWidth), 1);

		list.current.scrollBy({
			left: numCardsToScrollBy * itemWidth * delta,
			behavior: 'smooth',
		});
	};

	return (
		<PageSection aria-labelledby={HEADING_ID}>
			<div className="flex items-center justify-between gap-2">
				<PageHeading id={HEADING_ID}>{props.heading}</PageHeading>
				<div className="flex gap-2">
					<SquareIconButton onClick={() => scroll(-1)} disabled={scrollStatus === 'start'}>
						<ArrowLeftIcon className="size-5" />
						<span className="sr-only">Scroll left</span>
					</SquareIconButton>
					<SquareIconButton onClick={() => scroll(1)} disabled={scrollStatus === 'end'}>
						<ArrowRightIcon className="size-5" />
						<span className="sr-only">Scroll right</span>
					</SquareIconButton>
				</div>
			</div>
			<div
				onScroll={() => {
					if (!list.current) return;
					const listWidth = list.current.getBoundingClientRect().width;
					if (list.current.scrollLeft <= 0) setScrollStatus('start');
					else if (Math.ceil(list.current.scrollLeft + listWidth) >= list.current.scrollWidth)
						setScrollStatus('end');
					else setScrollStatus('middle');
				}}
				className="snap-x snap-mandatory overflow-x-auto sm:snap-none"
				ref={list}
			>
				{props.children}
			</div>
		</PageSection>
	);
}
