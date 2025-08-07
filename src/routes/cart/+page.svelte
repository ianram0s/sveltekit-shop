<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from '@lucide/svelte';
	import { cartState, removeFromCart, updateCartQuantity } from '@/global-states';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { EmptyCart } from '$lib/components/empty-cart';

	let showRemoveDialog = $state(false);
	let itemToRemove = $state<{
		productId: string;
		selectedColor?: string;
		selectedSize?: string;
		productTitle: string;
	} | null>(null);

	function handleQuantityChange(
		productId: string,
		delta: number,
		selectedColor?: string,
		selectedSize?: string
	) {
		const currentQuantity =
			cartState.items.find(
				(item) =>
					item.product.id === productId &&
					item.selectedColor === selectedColor &&
					item.selectedSize === selectedSize
			)?.quantity || 0;
		const newQuantity = currentQuantity + delta;

		if (newQuantity > 0) {
			updateCartQuantity(productId, newQuantity, selectedColor, selectedSize);
		} else if (newQuantity === 0) {
			const item = cartState.items.find(
				(item) =>
					item.product.id === productId &&
					item.selectedColor === selectedColor &&
					item.selectedSize === selectedSize
			);
			if (item) {
				itemToRemove = {
					productId,
					selectedColor,
					selectedSize,
					productTitle: item.product.title
				};
				showRemoveDialog = true;
			}
		}
	}

	function handleRemoveItem(
		productId: string,
		selectedColor?: string,
		selectedSize?: string,
		productTitle?: string
	) {
		itemToRemove = {
			productId,
			selectedColor,
			selectedSize,
			productTitle: productTitle || 'this item'
		};
		showRemoveDialog = true;
	}

	function confirmRemoveItem() {
		if (itemToRemove) {
			removeFromCart(itemToRemove.productId, itemToRemove.selectedColor, itemToRemove.selectedSize);
			itemToRemove = null;
			showRemoveDialog = false;
		}
	}

	function handleContinueShopping() {
		goto('/');
	}

	function handleCheckout() {
		goto('/checkout/step');
	}
</script>

<svelte:head>
	<title>Shopping Cart - Store</title>
	<meta name="description" content="Your shopping cart" />
</svelte:head>

<div class="py-1" in:fade={{ duration: 300 }}>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#if !cartState.isLoaded}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
				<h2 class="text-foreground mb-2 text-xl font-semibold">Loading...</h2>
				<p class="text-muted-foreground max-w-md">
					Please wait while we load your cart.
				</p>
			</div>
		{:else if cartState.items.length === 0}
			<!-- Empty Cart -->
			<EmptyCart />
		{:else}
			<div class="w-full">
				<h1
					class="font-integral text-foreground mb-6 text-[2rem] font-bold uppercase lg:text-[2.5rem]"
				>
					Your Cart
				</h1>
				<div class="w-full gap-8 lg:grid lg:grid-cols-[57%_43%]">
					<!-- Cart Items -->
					<div class="w-full">
						<div class="border-border bg-card rounded-lg border p-4 lg:p-6">
							{#each cartState.items as item, index (`${item.product.id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`)}
								<div class="flex gap-4" in:fade={{ duration: 200 }}>
									<!-- Product Image -->
									<div
										class="bg-muted aspect-squar size-25 flex-shrink-0 overflow-hidden rounded-md lg:size-31"
									>
										<img
											src={item.product.images[0]}
											alt={item.product.title}
											class="h-full w-full object-cover"
										/>
									</div>

									<!-- Product Details -->
									<div class="flex flex-1 items-center justify-between">
										<div class="flex h-full flex-col">
											<h3 class="text-foreground font-bold lg:text-xl">{item.product.title}</h3>
											<div class="text-foreground mt-1 flex flex-col text-xs lg:text-sm">
												{#if item.selectedSize}
													<span
														>Size: <span class="text-muted-foreground">{item.selectedSize}</span
														></span
													>
												{/if}
												{#if item.selectedColor}
													<span
														>Color: <span class="text-muted-foreground">{item.selectedColor}</span
														></span
													>
												{/if}
											</div>
											<!-- Price -->
											<span
												class="text-foreground flex h-full items-end text-xl font-bold lg:text-2xl"
											>
												${(Number(item.product.currentPrice) * item.quantity).toFixed(2)}
											</span>
										</div>
										<div class="flex h-full flex-col items-end justify-between">
											<!-- Remove Button -->
											<button
												class="text-destructive hover:text-destructive/70 cursor-pointer rounded p-1 transition-colors"
												onclick={() =>
													handleRemoveItem(
														item.product.id,
														item.selectedColor,
														item.selectedSize,
														item.product.title
													)}
												title="Remove item"
											>
												<Trash2 class="h-5 w-5" />
											</button>
											<!-- Quantity Controls -->
											<div class="border-border bg-muted flex items-center rounded-full border">
												<button
													class="hover:bg-accent flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-full transition-colors lg:h-11 lg:w-11"
													onclick={() =>
														handleQuantityChange(
															item.product.id,
															-1,
															item.selectedColor,
															item.selectedSize
														)}
												>
													<Minus class="h-4 w-4 lg:h-5 lg:w-5" />
												</button>
												<span
													class="flex h-6 w-8 items-center justify-center text-xs font-medium lg:h-8 lg:w-12 lg:text-sm"
												>
													{item.quantity}
												</span>
												<button
													class="hover:bg-accent flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-full transition-colors lg:h-11 lg:w-11"
													onclick={() =>
														handleQuantityChange(
															item.product.id,
															1,
															item.selectedColor,
															item.selectedSize
														)}
												>
													<Plus class="h-4 w-4 lg:h-5 lg:w-5" />
												</button>
											</div>
										</div>
									</div>
								</div>
								{#if index < cartState.items.length - 1}
									<Separator class="my-4 lg:my-6" />
								{/if}
							{/each}
						</div>
					</div>

					<!-- Order Summary -->
					<div class="mt-10 w-full lg:mt-0">
						<div class="border-border bg-card rounded-lg border p-6">
							<h2 class="text-foreground mb-5 text-xl font-semibold lg:mb-6 lg:text-2xl">
								Order Summary
							</h2>

							<div class="space-y-5 text-base lg:text-xl">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Subtotal</span>
									<span class="text-foreground font-medium">${cartState.totalPrice.toFixed(2)}</span
									>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Discount (-20%)</span>
									<span class="text-destructive font-medium"
										>-${(cartState.totalPrice * 0.2).toFixed(2)}</span
									>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Delivery Fee</span>
									<span class="text-foreground font-medium">$15.00</span>
								</div>
							</div>

							<Separator class="my-5" />

							<div class="flex justify-between">
								<span class="text-foreground text-base font-semibold lg:text-xl">Total</span>
								<span class="text-foreground text-xl font-semibold lg:text-2xl"
									>${(cartState.totalPrice * 0.8 + 15).toFixed(2)}</span
								>
							</div>

							<!-- Promo Code Input -->
							<div class="mt-4 flex gap-2 lg:mt-6">
								<div
									class="border-border bg-muted flex flex-1 items-center rounded-md border px-2 py-2 text-sm lg:px-3 lg:text-base"
								>
									<span class="text-muted-foreground mr-2 text-sm"></span>
									<input
										type="text"
										placeholder="Add promo code"
										class="placeholder:text-muted-foreground min-w-0text-sm w-full bg-transparent outline-none"
									/>
								</div>
								<Button
									variant="default"
									class="cursor-pointer rounded-full px-3 py-2 text-sm lg:px-6 lg:py-5 lg:text-base"
									>Apply</Button
								>
							</div>

							<Button
								onclick={handleCheckout}
								class="mt-4 flex w-full cursor-pointer items-center justify-center rounded-full py-6 text-sm lg:mt-6 lg:text-base"
							>
								Go to Checkout
								<ArrowRight class="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Remove Item Confirmation Dialog -->
	<AlertDialog.Root bind:open={showRemoveDialog}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Remove Item</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to remove "{itemToRemove?.productTitle}" from your cart?
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel class="cursor-pointer">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action class="cursor-pointer" onclick={confirmRemoveItem}
					>Remove Item</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
