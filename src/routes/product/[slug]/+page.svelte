<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Minus, Plus, Check } from '@lucide/svelte';
	import type { ProductWithCategories } from '$lib/types/product';
	import { addToCart } from '@/global-states';

	let {
		data
	}: {
		data: {
			product: ProductWithCategories;
		};
	} = $props();

	let selectedColor = $state(data.product.availableColors[0]?.name || '');
	let selectedSize = $state(data.product.availableSizes[0] || '');
	let quantity = $state(1);
	let selectedImageIndex = $state(0);

	const discountPercentage = $derived(
		data.product.originalPrice
			? Math.round(
					100 * (1 - Number(data.product.currentPrice) / Number(data.product.originalPrice))
				)
			: 0
	);

	function handleColorSelect(colorName: string) {
		selectedColor = colorName;
	}

	function handleSizeSelect(size: string) {
		selectedSize = size;
	}

	function handleQuantityChange(delta: number) {
		const newQuantity = quantity + delta;
		if (newQuantity >= 1 && newQuantity <= 10) {
			quantity = newQuantity;
		}
	}

	function handleAddToCart() {
		// TODO: Implement add to cart functionality
		console.log('Adding to cart:', {
			product: data.product.title,
			color: selectedColor,
			size: selectedSize,
			quantity
		});
		addToCart(data.product, quantity);
	}

	function selectImage(index: number) {
		selectedImageIndex = index;
	}
</script>

<svelte:head>
	<title>{data.product.title} - Store</title>
	<meta name="description" content={data.product.description} />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8" in:fade={{ duration: 300 }}>
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Product Images Section -->
		<div class="flex flex-col gap-4 lg:flex-row">
			<!-- Main Product Image -->
			<div class="flex-1">
				<div class="bg-muted aspect-square overflow-hidden rounded-2xl">
					<img
						src={data.product.images[selectedImageIndex]}
						alt={data.product.title}
						class="h-full w-full object-cover"
					/>
				</div>
			</div>

			<!-- Thumbnail Images -->
			<div class="flex gap-3 lg:order-first lg:flex-col">
				{#each data.product.images as image, index}
					<button
						class="aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:opacity-80 {selectedImageIndex ===
						index
							? 'border-primary'
							: 'border-border'}"
						onclick={() => selectImage(index)}
					>
						<img
							src={image}
							alt={`${data.product.title} - View ${index + 1}`}
							class="h-full w-full object-cover"
						/>
					</button>
				{/each}
			</div>
		</div>

		<!-- Product Information Section -->
		<div class="flex flex-col">
			<!-- Product Title -->
			<h1 class="font-integral text-foreground mb-3 text-2xl font-bold md:text-[2.5rem]">
				{data.product.title}
			</h1>

			<!-- Pricing -->
			<div class="mb-5 flex items-center gap-3">
				<span class="text-foreground text-2xl font-bold md:text-[2rem]">
					${data.product.currentPrice}
				</span>
				{#if data.product.originalPrice}
					<span class="text-muted-foreground text-2xl line-through md:text-[2rem]">
						${data.product.originalPrice}
					</span>
					<span
						class="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-sm font-semibold"
					>
						-{discountPercentage}%
					</span>
				{/if}
			</div>

			<!-- Product Description -->
			<p class="text-muted-foreground mb-6 text-sm leading-relaxed md:text-base">
				{data.product.description}
			</p>

			<!-- Color Selection -->
			{#if data.product.availableColors.length > 0}
				<div class="mb-6 space-y-3">
					<h3 class="text-foreground text-sm font-semibold md:text-base">Select Colors</h3>
					<div class="flex gap-3">
						{#each data.product.availableColors as color}
							<button
								class="relative h-12 w-12 rounded-full border-2 transition-all duration-200 hover:scale-110 {selectedColor ===
								color.name
									? 'border-primary'
									: 'border-border'}"
								style="background-color: {color.hex}"
								onclick={() => handleColorSelect(color.name)}
								title={color.name}
							>
								{#if selectedColor === color.name}
									<div class="absolute inset-0 flex items-center justify-center">
										<Check
											class="h-6 w-6 drop-shadow-lg"
											style="color: {color.name.toLowerCase() === 'white' ? 'black' : 'white'}"
										/>
									</div>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Size Selection -->
			{#if data.product.availableSizes.length > 0}
				<div class="mb-6 space-y-3">
					<h3 class="text-foreground text-sm font-semibold md:text-base">Choose Size</h3>
					<div class="flex gap-3 text-sm md:text-base">
						{#each data.product.availableSizes as size}
							<button
								class="rounded-lg border-2 px-4 py-2 font-medium transition-all duration-200 hover:scale-105 {selectedSize ===
								size
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-border bg-background text-foreground hover:border-primary/50'}"
								onclick={() => handleSizeSelect(size)}
							>
								{size}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Quantity Selector and Add to Cart -->
			<div class="flex items-center gap-4">
				<div class="border-border bg-muted flex items-center rounded-full border">
					<button
						class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-l-full transition-colors duration-200"
						onclick={() => handleQuantityChange(-1)}
					>
						<Minus class="h-4 w-4" />
					</button>
					<span class="flex h-12 w-16 items-center justify-center font-medium">
						{quantity}
					</span>
					<button
						class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-r-full transition-colors duration-200"
						onclick={() => handleQuantityChange(1)}
					>
						<Plus class="h-4 w-4" />
					</button>
				</div>

				<!-- Add to Cart Button -->
				<button
					class="bg-foreground text-background hover:bg-foreground/90 h-12 flex-1 cursor-pointer rounded-full text-sm font-semibold transition-colors duration-200 disabled:opacity-50 md:text-base"
					disabled={!data.product.inStock}
					onclick={handleAddToCart}
				>
					{data.product.inStock ? 'Add to Cart' : 'Out of Stock'}
				</button>
			</div>

			<!-- Stock Status -->
			{#if !data.product.inStock}
				<p class="text-destructive text-center text-sm">This item is currently out of stock</p>
			{/if}
		</div>
	</div>
</div>
