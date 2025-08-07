<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, Check, Shield } from '@lucide/svelte';
	import { cartState } from '@/global-states';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { EmptyCart } from '$lib/components/empty-cart';
	import { checkoutStorage } from '$lib/storage/checkoutStorage';

	let { children } = $props();

	const currentStep = $derived(() => {
		const path = page.url.pathname;
		if (path.includes('/customer')) return 1;
		if (path.includes('/shipping')) return 2;
		if (path.includes('/payment')) return 3;
		if (path.includes('/review')) return 4;
		return 1;
	});

	const totalSteps = 4;

	$effect(() => {
		if (browser) {
			if (cartState.items.length === 0) {
				checkoutStorage.clear();
				document.cookie = 'checkout_progress=; path=/; max-age=0';
			} else {
				const checkoutData = checkoutStorage.get();
				if (
					checkoutData &&
					(checkoutData.customer ||
						checkoutData.shipping ||
						checkoutData.payment ||
						checkoutData.review)
				) {
					document.cookie = `checkout_progress=${encodeURIComponent(JSON.stringify(checkoutData))}; path=/; max-age=86400; samesite=lax`;
				}
			}
		}
	});

	function goToStep(step: number) {
		if (step <= currentStep()) {
			// Check if previous steps are completed
			if (browser) {
				try {
					const checkoutData = checkoutStorage.get();

					if (step === 2 && !checkoutData.customer) {
						goto('/checkout/step/customer');
						return;
					}

					if (step === 3 && (!checkoutData.customer || !checkoutData.shipping)) {
						if (!checkoutData.customer) {
							goto('/checkout/step/customer');
						} else {
							goto('/checkout/step/shipping');
						}
						return;
					}

					if (
						step === 4 &&
						(!checkoutData.customer || !checkoutData.shipping || !checkoutData.payment)
					) {
						if (!checkoutData.customer) {
							goto('/checkout/step/customer');
						} else if (!checkoutData.shipping) {
							goto('/checkout/step/shipping');
						} else {
							goto('/checkout/step/payment');
						}
						return;
					}
				} catch (error) {
					console.warn('Error checking step completion:', error);
					// If we can't load data, redirect to first step
					if (step > 1) {
						goto('/checkout/step/customer');
						return;
					}
				}
			}

			switch (step) {
				case 1:
					goto('/checkout/step/customer');
					break;
				case 2:
					goto('/checkout/step/shipping');
					break;
				case 3:
					goto('/checkout/step/payment');
					break;
				case 4:
					goto('/checkout/step/review');
					break;
			}
		}
	}

	function getSubtotal(): number {
		return cartState.totalPrice;
	}

	function getDiscount(): number {
		return cartState.totalPrice * 0.2;
	}

	function getShippingCost(): number {
		if (browser) {
			try {
				const shippingData = checkoutStorage.getStep('shipping');
				const shippingMethod = shippingData?.shippingMethod || 'standard';

				const shippingMethods = [
					{ id: 'standard', price: 15.0 },
					{ id: 'express', price: 25.0 },
					{ id: 'overnight', price: 45.0 }
				];

				const method = shippingMethods.find((m) => m.id === shippingMethod);
				return method?.price || 15.0;
			} catch (error) {
				console.warn('Error getting shipping cost:', error);
				return 15.0;
			}
		}
		return 15.0;
	}

	function getTotalPrice(): number {
		return getSubtotal() - getDiscount() + getShippingCost();
	}
</script>

<svelte:head>
	<title>Checkout - Store</title>
	<meta name="description" content="Complete your purchase" />
</svelte:head>

{#if !cartState.isLoaded}
	<div class="py-1" in:fade={{ duration: 300 }}>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div
					class="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
				></div>
				<h2 class="text-foreground mb-2 text-xl font-semibold">Loading...</h2>
				<p class="text-muted-foreground max-w-md">Please wait while we load your cart.</p>
			</div>
		</div>
	</div>
{:else if cartState.items.length === 0 && !page.url.pathname.includes('/success')}
	<div class="py-1" in:fade={{ duration: 300 }}>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<EmptyCart title="Checkout" />
		</div>
	</div>
{:else}
	<div class="py-1" in:fade={{ duration: 300 }}>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="mb-8">
				<Button
					variant="ghost"
					onclick={() => {
						if (browser) {
							checkoutStorage.clear();
						}
						goto('/cart');
					}}
					class="mb-4 cursor-pointer"
				>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to Cart
				</Button>
				<h1 class="text-foreground text-3xl font-bold">Checkout</h1>
			</div>

			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Main Content Area -->
				<div class="lg:col-span-2">
					<!-- Progress Steps -->
					<div class="mb-8 flex justify-center">
						<!-- Desktop Progress Steps -->
						<div class="hidden w-full max-w-2xl md:block">
							<div class="relative mb-8 flex items-center justify-between">
								{#each Array.from({ length: totalSteps }, (_, i) => i + 1) as step}
									<div class={`flex items-center ${step < 4 ? 'flex-1' : ''}`}>
										<div class="relative flex flex-col items-center">
											<button
												onclick={() => goToStep(step)}
												class="relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 {currentStep() >=
												step
													? 'border-primary bg-primary text-primary-foreground shadow-sm'
													: 'border-border bg-background text-muted-foreground hover:border-primary/50'} {currentStep() >
												step
													? 'bg-primary border-primary'
													: ''}"
												disabled={currentStep() < step}
											>
												{#if currentStep() > step}
													<Check class="h-6 w-6" />
												{:else}
													<span class="text-sm font-semibold">{step}</span>
												{/if}
											</button>
											<div class="absolute top-12 text-center">
												<p
													class="text-sm font-medium {currentStep() >= step
														? 'text-foreground'
														: 'text-muted-foreground'} whitespace-nowrap"
												>
													{#if step === 1}
														Customer Info
													{:else if step === 2}
														Shipping
													{:else if step === 3}
														Payment
													{:else if step === 4}
														Review
													{/if}
												</p>
											</div>
										</div>
										{#if step < totalSteps}
											<div class="relative -mx-6 flex-1">
												<div class="bg-border relative h-0.5">
													<div
														class="bg-primary absolute inset-0 transition-all duration-300"
														style="width: {currentStep() > step ? '100%' : '0%'}"
													></div>
												</div>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<!-- Mobile Progress Steps -->
						<div class="w-full max-w-md md:hidden">
							<div class="mb-4 flex items-center justify-between">
								{#each Array.from({ length: totalSteps }, (_, i) => i + 1) as step}
									<div class="flex flex-1 items-center">
										<button
											onclick={() => goToStep(step)}
											class="relative z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 {currentStep() >=
											step
												? 'border-primary bg-primary text-primary-foreground shadow-sm'
												: 'border-border bg-background text-muted-foreground'} {currentStep() > step
												? 'bg-primary/10 border-primary/50'
												: ''}"
											disabled={currentStep() < step}
										>
											{#if currentStep() > step}
												<Check class="text-success h-5 w-5" />
											{:else}
												<span class="text-sm font-semibold">{step}</span>
											{/if}
										</button>
										{#if step < totalSteps}
											<div class="relative -mx-5 flex-1">
												<div class="bg-border relative h-0.5">
													<div
														class="bg-primary absolute inset-0 transition-all duration-300"
														style="width: {currentStep() > step ? '100%' : '0%'}"
													></div>
												</div>
											</div>
										{/if}
									</div>
								{/each}
							</div>
							<div class="text-center">
								<p class="text-foreground text-sm font-medium">
									Step {currentStep()} of {totalSteps}:
									{#if currentStep() === 1}
										Customer Information
									{:else if currentStep() === 2}
										Shipping Information
									{:else if currentStep() === 3}
										Payment Information
									{:else if currentStep() === 4}
										Review & Confirmation
									{/if}
								</p>
							</div>
						</div>
					</div>

					<!-- Step Content -->
					<div class="bg-card border-border rounded-lg border p-6">
						{@render children()}
					</div>
				</div>

				<!-- Order Summary Sidebar -->
				<div class="lg:col-span-1">
					<div class="bg-card border-border sticky top-4 rounded-lg border p-6">
						<h2 class="mb-4 text-xl font-semibold">Order Summary</h2>

						<div class="space-y-4">
							<!-- Cart Items -->
							<div class="space-y-3">
								{#each cartState.items as item}
									<div class="flex items-center gap-3">
										<div class="bg-muted h-12 w-12 flex-shrink-0 rounded-md"></div>
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-medium">{item.product.title}</p>
											<p class="text-muted-foreground text-xs">
												Qty: {item.quantity}
												{#if item.selectedColor}
													• {item.selectedColor}
												{/if}
												{#if item.selectedSize}
													• {item.selectedSize}
												{/if}
											</p>
										</div>
										<div class="text-sm font-medium">
											${(Number(item.product.currentPrice) * item.quantity).toFixed(2)}
										</div>
									</div>
								{/each}
							</div>

							<Separator />

							<!-- Price Breakdown -->
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Subtotal</span>
									<span>${getSubtotal().toFixed(2)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Discount (20%)</span>
									<span class="text-destructive">-${getDiscount().toFixed(2)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Shipping</span>
									<span>${getShippingCost().toFixed(2)}</span>
								</div>
							</div>

							<Separator />

							<!-- Total -->
							<div class="flex justify-between text-lg font-semibold">
								<span>Total</span>
								<span>${getTotalPrice().toFixed(2)}</span>
							</div>

							<!-- Security Badge -->
							<div class="text-muted-foreground flex items-center gap-2 text-xs">
								<Shield class="h-4 w-4" />
								<span>Secure checkout powered by Stripe</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
