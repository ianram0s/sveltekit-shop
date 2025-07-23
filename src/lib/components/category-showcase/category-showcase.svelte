<script lang="ts">
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/product-card/product-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Product } from '$lib/types/product';

	interface Props {
		title: string;
		products: Product[];
		categorySlug: string;
	}

	let { title, products, categorySlug }: Props = $props();

	function handleViewAll() {
		goto(`/${categorySlug}`);
	}

	function handleProductClick(product: Product) {
		goto(`/product/${product.slug}`);
	}

	const showcaseProducts = $derived(products.slice(0, 4));
</script>

<section class="mb-20 w-full lg:mb-32">
	<div class="container mx-auto px-4">
		<h2 class="text-foreground font-integral mb-8 text-center text-4xl font-bold lg:text-5xl">
			{title}
		</h2>

		<div class="mb-8 overflow-hidden">
			<div class="flex justify-center">
				<div class="scrollbar-hide flex max-w-full gap-4 overflow-x-auto pb-4">
					{#each showcaseProducts as product, index}
						<div class="w-64 flex-shrink-0 md:w-64 lg:w-72 xl:w-80">
							<ProductCard {product} {index} onclick={handleProductClick} />
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="flex justify-center">
			<Button
				variant="ghost"
				size="lg"
				onclick={handleViewAll}
				class="border-border cursor-pointer rounded-full border-1 transition-colors duration-200"
			>
				View All
			</Button>
		</div>
	</div>
</section>
