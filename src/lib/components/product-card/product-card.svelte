<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Product } from '$lib/types/product';

	interface Props {
		product: Product;
		index?: number;
		onclick?: (product: Product) => void;
	}

	let { product, index = 0, onclick }: Props = $props();

	function handleClick() {
		if (onclick) {
			onclick(product);
		}
	}

	const discountPercentage = $derived(
		product.originalPrice ? Math.round(100 * (1 - Number(product.currentPrice) / Number(product.originalPrice))) : 0
	);
</script>

<div
	class="bg-background flex cursor-pointer flex-col items-center rounded-2xl p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
	in:fly={{ y: 30, duration: 400, delay: index * 50, easing: quintOut }}
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	role="button"
	tabindex="0"
>
	<div
		class="mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl"
	>
		<img
			src={product.images[0]}
			alt={product.title}
			class="bg-muted h-75 w-75 rounded-xl object-contain transition-transform duration-300 hover:scale-105"
		/>
	</div>
	<div class="flex w-full flex-col items-start">
		<h3
			class="text-foreground hover:text-primary mb-1 text-base font-semibold transition-colors duration-200 md:text-xl"
		>
			{product.title}
		</h3>
		<!-- Price row -->
		<div class="mb-1 flex items-center gap-2">
			<span class="text-foreground text-xl font-bold md:text-2xl">${product.currentPrice}</span>
			{#if product.originalPrice}
				<span class="text-muted-foreground text-xl line-through md:text-2xl"
					>${product.originalPrice}</span
				>
				<span
					class="bg-destructive/10 text-destructive font-semibolde ml-1 rounded-full px-2 py-0.5 text-xs"
				>
					-{discountPercentage}%
				</span>
			{/if}
		</div>
	</div>
</div>
