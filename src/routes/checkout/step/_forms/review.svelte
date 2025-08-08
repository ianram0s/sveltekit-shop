<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import {
		reviewFormSchema,
		type ReviewFormInput,
		customerFormSchema,
		shippingFormSchema,
		paymentFormSchema
	} from '@/schemas';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { AlertCircle, User, MapPin, Truck, CheckCircle2 } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { cartState, clearCart } from '@/global-states';
	import { checkoutStorage, type EnhancedCheckoutData } from '$lib/storage/checkoutStorage';

	let {
		formData
	}: {
		formData: SuperValidated<ReviewFormInput>;
	} = $props();

	let checkoutData = $state<EnhancedCheckoutData>({} as EnhancedCheckoutData);
	let validationErrors = $state<string[]>([]);
	let isValidating = $state(false);
	let dataLoaded = $state(false);
	let storageError = $state<string | null>(null);
	let isProcessing = $state(false);

	const { form, errors, enhance, submitting } = superForm(formData, {
		validators: zod4(reviewFormSchema),
		resetForm: false,
		dataType: 'form',
		onUpdated: ({ form }) => {
			if (form.valid && validationErrors.length === 0) {
				submitOrder();
			} else {
				isProcessing = false;
			}
		}
	});

	$effect(() => {
		if (browser && !dataLoaded) {
			try {
				const data = checkoutStorage.get({
					onError: (error) => {
						console.error('Error loading checkout data:', error);
						storageError = 'Could not load checkout information. Some data may be missing.';
					}
				});

				checkoutData = data;

				if (data.review) {
					$form.orderNotes = data.review.orderNotes || '';
					$form.termsAccepted = data.review.termsAccepted || false;
				}

				dataLoaded = true;
				validateAllSteps();
			} catch (error) {
				console.error('Failed to load checkout data:', error);
				storageError = 'Could not load checkout information. Please refresh and try again.';
				dataLoaded = true;
			}
		}
	});

	function validateAllSteps() {
		if (isValidating) return; // Prevent recursive calls

		isValidating = true;
		const errors: string[] = [];

		const customerResult = customerFormSchema.safeParse(checkoutData.customer);
		if (!customerResult.success) {
			errors.push('Customer information is incomplete or invalid');
		}

		const shippingResult = shippingFormSchema.safeParse(checkoutData.shipping);
		if (!shippingResult.success) {
			errors.push('Shipping information is incomplete or invalid');
		}

		const paymentResult = paymentFormSchema.safeParse(checkoutData.payment);
		if (!paymentResult.success) {
			errors.push('Payment information is incomplete or invalid');
		}

		if (!cartState.items || cartState.items.length === 0) {
			errors.push('Your cart is empty');
		}

		validationErrors = errors;
		isValidating = false;
	}

	async function submitOrder() {
		try {
			const success = checkoutStorage.updateStep('review', $form, {
				onError: (error) => {
					console.error('Failed to save review data:', error);
					storageError = 'Failed to save review information.';
					isProcessing = false;
				}
			});

			if (!success) {
				console.error('Failed to save review data');
				isProcessing = false;
				return;
			}

			const checkoutData = checkoutStorage.get();
			document.cookie = `checkout_progress=${encodeURIComponent(JSON.stringify(checkoutData))}; path=/; max-age=86400; samesite=lax`;

			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					checkoutData: checkoutData,
					cartItems: cartState.items
				})
			});

			const result = await response.json();

			if (result.success && result.orderId) {
				checkoutStorage.clear();
				clearCart();

				goto(`/checkout/success?orderId=${result.orderId}`);
			} else {
				console.error('Order creation failed:', result.error);
				isProcessing = false;
			}
		} catch (error) {
			console.error('Error submitting order:', error);
			isProcessing = false;
		}
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	const subtotal = $derived(() => {
		if (!cartState.items?.length) return 0;
		return cartState.items.reduce(
			(sum, item) => sum + Number(item.product.currentPrice) * item.quantity,
			0
		);
	});

	const shippingCost = $derived(() => {
		const method = checkoutData.shipping?.shippingMethod;
		if (method === 'express') return 25.0;
		if (method === 'overnight') return 45.0;
		return 15.0;
	});

	const total = $derived(() => subtotal() + shippingCost());
</script>

<div class="space-y-6">
	<!-- Storage Errors -->
	{#if storageError}
		<div class="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
			<div class="flex items-start">
				<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0" />
				<div class="ml-3">
					<h3 class="font-medium">Storage Warning</h3>
					<p class="text-sm">{storageError}</p>
					<button
						type="button"
						onclick={() => (storageError = null)}
						class="mt-2 text-sm underline hover:no-underline"
					>
						Dismiss
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Validation Errors -->
	{#if validationErrors.length > 0}
		<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
			<div class="flex items-start">
				<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0" />
				<div class="ml-3">
					<h3 class="font-medium">Please fix the following issues:</h3>
					<ul class="mt-2 list-inside list-disc space-y-1 text-sm">
						{#each validationErrors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}

	<!-- Order Summary -->
	<div class="bg-muted/30 rounded-lg p-6">
		<h3 class="text-foreground mb-4 text-lg font-semibold">Order Summary</h3>

		<!-- Cart Items -->
		<div class="space-y-3">
			{#each cartState.items as item (item.product.id + (item.selectedSize || '') + (item.selectedColor || ''))}
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3">
						{#if item.product.images && item.product.images[0]}
							<img
								src={item.product.images[0]}
								alt={item.product.title}
								class="h-12 w-12 rounded object-cover"
							/>
						{/if}
						<div>
							<p class="text-foreground font-medium">{item.product.title}</p>
							<p class="text-muted-foreground text-sm">Qty: {item.quantity}</p>
							{#if item.selectedSize}
								<p class="text-muted-foreground text-xs">Size: {item.selectedSize}</p>
							{/if}
							{#if item.selectedColor}
								<p class="text-muted-foreground text-xs">Color: {item.selectedColor}</p>
							{/if}
						</div>
					</div>
					<p class="text-foreground font-medium">
						{formatPrice(Number(item.product.currentPrice) * item.quantity)}
					</p>
				</div>
			{/each}
		</div>

		<Separator class="my-4" />

		<!-- Totals -->
		<div class="space-y-2">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Subtotal</span>
				<span class="text-foreground">{formatPrice(subtotal())}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Shipping</span>
				<span class="text-foreground">{formatPrice(shippingCost())}</span>
			</div>
			<Separator />
			<div class="flex justify-between text-lg font-semibold">
				<span class="text-foreground">Total</span>
				<span class="text-foreground">{formatPrice(total())}</span>
			</div>
		</div>
	</div>

	<!-- Review Information -->
	<div class="grid gap-6 md:grid-cols-2">
		<!-- Customer Info -->
		<div class="border-input bg-background rounded-lg border p-4">
			<div class="mb-3 flex items-center space-x-2">
				<User class="text-primary h-5 w-5" />
				<h4 class="text-foreground font-semibold">Customer Information</h4>
			</div>
			{#if checkoutData.customer}
				<div class="text-muted-foreground space-y-1 text-sm">
					<p>{checkoutData.customer.firstName} {checkoutData.customer.lastName}</p>
					<p>{checkoutData.customer.email}</p>
					<p>{checkoutData.customer.phone}</p>
				</div>
			{:else}
				<p class="text-sm text-red-600">Customer information missing</p>
			{/if}
		</div>

		<!-- Shipping Info -->
		<div class="border-input bg-background rounded-lg border p-4">
			<div class="mb-3 flex items-center space-x-2">
				<MapPin class="text-primary h-5 w-5" />
				<h4 class="text-foreground font-semibold">Shipping Address</h4>
			</div>
			{#if checkoutData.shipping}
				<div class="text-muted-foreground space-y-1 text-sm">
					<p>{checkoutData.shipping.address}</p>
					<p>
						{checkoutData.shipping.city}, {checkoutData.shipping.state}
						{checkoutData.shipping.zipCode}
					</p>
					<p>{checkoutData.shipping.country}</p>
					<p class="capitalize">Shipping: {checkoutData.shipping.shippingMethod} shipping</p>
				</div>
			{:else}
				<p class="text-sm text-red-600">Shipping information missing</p>
			{/if}
		</div>

		<!-- Payment Info -->
		<div class="border-input bg-background rounded-lg border p-4 md:col-span-2">
			<div class="mb-3 flex items-center space-x-2">
				<Truck class="text-primary h-5 w-5" />
				<h4 class="text-foreground font-semibold">Payment Method</h4>
			</div>
			{#if checkoutData.payment}
				<div class="text-muted-foreground space-y-1 text-sm">
					<p class="flex items-center">
						<CheckCircle2 class="mr-2 h-4 w-4 text-green-600" />
						Cash on Delivery
					</p>
				</div>
			{:else}
				<p class="text-sm text-red-600">Payment information missing</p>
			{/if}
		</div>
	</div>

	<form method="post" action="?/validateReview" use:enhance onsubmit={() => (isProcessing = true)}>
		<!-- Order Notes -->
		<div>
			<label for="orderNotes" class="text-foreground mb-2 block text-sm font-medium"
				>Order Notes (Optional)</label
			>
			<textarea
				id="orderNotes"
				name="orderNotes"
				bind:value={$form.orderNotes}
				rows="3"
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.orderNotes
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="Any additional notes for your order..."
			></textarea>
			{#if $errors.orderNotes}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircle class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.orderNotes}</p>
				</div>
			{/if}
		</div>

		<!-- Terms and Conditions -->
		<div class="my-6">
			<div class="flex items-start space-x-3">
				<input
					id="termsAccepted"
					name="termsAccepted"
					type="checkbox"
					bind:checked={$form.termsAccepted}
					class="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-gray-300"
				/>
				<label for="termsAccepted" class="text-foreground text-sm">
					I agree to the <a href="/terms" class="text-primary hover:underline"
						>Terms and Conditions</a
					>
					and
					<a href="/privacy" class="text-primary hover:underline">Privacy Policy</a> *
				</label>
			</div>
			{#if $errors.termsAccepted}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircle class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.termsAccepted}</p>
				</div>
			{/if}
		</div>

		<Separator />

		<!-- Action Buttons -->
		<div class="mt-4 flex justify-between md:mt-6">
			<Button
				type="button"
				variant="outline"
				onclick={() => goto('/checkout/step/payment')}
				class="cursor-pointer"
			>
				<span class="md:hidden">Back</span>
				<span class="hidden md:inline">Back to Payment</span>
			</Button>
			<Button
				type="submit"
				disabled={$submitting || validationErrors.length > 0 || isValidating || isProcessing}
				class="cursor-pointer"
			>
				{#if isProcessing || $submitting}
					<span class="mr-0 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
				{:else}
					Place Order
				{/if}
			</Button>
		</div>
	</form>
</div>
