<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import type { Product, Color, Category } from '$lib/types/product';
	import { SlidersHorizontal, X, Package } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { DualSlider } from '@/components/dual-slider-input';
	import { ProductCard } from '@/components/product-card';
	import { FilterSidebar, ColorFilter, SizeFilter } from '@/components/filters';
	import { LoadingOverlay } from '@/components/loading-overlay';

	let showFilterModal = $state(false);

	let {
		data
	}: {
		data: {
			category: Category;
			products: Product[];
			colors: Color[];
			sizes: string[];
			minPrice: number | null;
			maxPrice: number | null;
			colorFilters: string[];
			sizeFilters: string[];
		};
	} = $props();

	let priceRange = $state<[number, number]>([data.minPrice ?? 0, data.maxPrice ?? 100]);
	let loading = $state(false);

	let selectedColors = $derived(new Set(data.colorFilters));
	let selectedSizes = $derived(new Set(data.sizeFilters));

	const minPossible = 0;
	const maxPossible = 100;

	function updateFilters() {
		const params = new URLSearchParams();
		if (priceRange[0] !== minPossible) params.set('minPrice', priceRange[0].toString());
		if (priceRange[1] !== maxPossible) params.set('maxPrice', priceRange[1].toString());
		selectedColors.forEach((c) => params.append('color', c));
		selectedSizes.forEach((s) => params.append('size', s));
		loading = true;
		goto(`/${data.category.slug}?${params.toString()}`);
	}

	function handlePriceChange(range: [number, number]) {
		priceRange = range;
		updateFilters();
	}

	function toggleColor(color: string) {
		if (selectedColors.has(color)) selectedColors.delete(color);
		else selectedColors.add(color);
		updateFilters();
	}

	function toggleSize(size: string) {
		if (selectedSizes.has(size)) selectedSizes.delete(size);
		else selectedSizes.add(size);
		updateFilters();
	}

	function closeModal() {
		showFilterModal = false;
	}

	function handleModalClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleProductClick(product: Product) {
		goto(`/product/${product.slug}`);
	}

	afterNavigate(() => {
		loading = false;
	});
</script>

<svelte:head>
	<title>{data.category.name} - Store</title>
</svelte:head>

<div class="flex flex-col gap-6" in:fade={{ duration: 300 }}>
	<div class="mx-auto w-full max-w-7xl">
		<div class="flex gap-8">
			<!-- Desktop Sidebar Filters -->
			<FilterSidebar
				colors={data.colors}
				sizes={data.sizes}
				{minPossible}
				{maxPossible}
				{priceRange}
				{selectedColors}
				{selectedSizes}
				onPriceChange={handlePriceChange}
				onColorToggle={toggleColor}
				onSizeToggle={toggleSize}
			/>

			<!-- Product Grid -->
			<main class="flex-1" in:fly={{ x: 50, duration: 400, easing: quintOut }}>
				<!-- Header with title and filters button -->
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-foreground text-2xl font-bold" in:fade={{ delay: 200, duration: 400 }}>
						{data.category.name}
					</h2>
					<button
						class="border-border bg-background hover:bg-muted/50 flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors duration-200 lg:hidden"
						onclick={() => (showFilterModal = true)}
					>
						<SlidersHorizontal class="h-5 w-5" />
						<span class="text-sm font-medium">Filters</span>
					</button>
				</div>

				<div class="relative">
					{#if data.products.length > 0}
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
							{#each data.products as product, i}
								<ProductCard {product} index={i} onclick={handleProductClick} />
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center px-4 py-16 text-center">
							<div
								class="bg-muted/30 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
							>
								<Package class="text-muted-foreground h-12 w-12" />
							</div>
							<h3 class="text-foreground mb-2 text-xl font-semibold">No products found</h3>
							<p class="text-muted-foreground mb-6 max-w-md leading-relaxed">
								We couldn't find any products matching your current filters. Try adjusting your
								search criteria or browse our full collection.
							</p>
						</div>
					{/if}
					<LoadingOverlay visible={loading} message="Filtering products..." />
				</div>
			</main>
		</div>
	</div>
</div>

<!-- Mobile Filter Modal -->
{#if showFilterModal}
	<div
		class="fixed inset-0 z-50 flex items-end bg-black/50 lg:hidden"
		onclick={handleModalClick}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		role="button"
		tabindex="0"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
		<div
			class="bg-background max-h-[80vh] w-full overflow-y-auto rounded-t-2xl"
			in:fly={{ y: 100, duration: 300, easing: quintOut }}
			out:fly={{ y: 100, duration: 300, easing: quintOut }}
		>
			<!-- Modal Header -->
			<div
				class="border-border bg-background sticky top-0 z-10 flex items-center justify-between border-b p-4"
			>
				<h3 class="text-foreground text-lg font-semibold">Filters</h3>
				<button
					class="hover:bg-muted/50 rounded-full p-2 transition-colors duration-200"
					onclick={closeModal}
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Modal Content -->
			<div class="space-y-6 p-4">
				<!-- Price Section -->
				<div>
					<h4 class="text-foreground mb-3 font-semibold">Price</h4>
					<DualSlider
						min={minPossible}
						max={maxPossible}
						value={priceRange}
						on:change={(e: CustomEvent<[number, number]>) => handlePriceChange(e.detail)}
						class="w-full"
					/>
				</div>

				<!-- Colors Section -->
				<div>
					<h4 class="text-foreground mb-3 font-semibold">Colors</h4>
					<ColorFilter colors={data.colors} {selectedColors} onToggleColor={toggleColor} />
				</div>

				<!-- Size Section -->
				<div>
					<h4 class="text-foreground mb-3 font-semibold">Size</h4>
					<SizeFilter sizes={data.sizes} {selectedSizes} onToggleSize={toggleSize} />
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="border-border bg-background sticky bottom-0 border-t p-4">
				<button
					class="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 font-medium transition-colors duration-200"
					onclick={closeModal}
				>
					Apply Filters
				</button>
			</div>
		</div>
	</div>
{/if}
