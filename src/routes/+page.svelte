<script lang="ts">
	import { CategoryShowcase } from '$lib/components/category-showcase';
	import type { Product } from '$lib/types/product';

	let {
		data
	}: {
		data: {
			newArrivalsProducts: Product[];
			topSellingProducts: Product[];
		};
	} = $props();
</script>

<svelte:head>
	<title>Home - Svelte Store Demo</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<div class="container mx-auto mb-8 px-4"></div>

	<CategoryShowcase
		title="NEW ARRIVALS"
		products={data.newArrivalsProducts}
		categorySlug="new-arrivals"
	/>
	<CategoryShowcase
		title="TOP SELLING"
		products={data.topSellingProducts}
		categorySlug="top-selling"
	/>
</div>
