<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { paymentFormSchema, type PaymentFormInput } from '@/schemas';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { AlertCircle, Truck } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { checkoutStorage } from '$lib/storage/checkoutStorage';

	let {
		formData
	}: {
		formData: SuperValidated<PaymentFormInput>;
	} = $props();

	let storageError = $state<string | null>(null);
	let isProcessing = $state(false);

	const { form, errors, enhance, submitting } = superForm(formData, {
		validators: zod4(paymentFormSchema),
		resetForm: false,
		dataType: 'form',
		onUpdated: ({ form }) => {
			if (form.valid) {
				if (browser) {
					const success = checkoutStorage.updateStep('payment', form.data, {
						onError: (error) => {
							console.error('Failed to save payment data:', error);
							storageError = 'Failed to save payment information. Please try again.';
							isProcessing = false;
						}
					});

					if (success) {
						const checkoutData = checkoutStorage.get();
						document.cookie = `checkout_progress=${encodeURIComponent(JSON.stringify(checkoutData))}; path=/; max-age=86400; samesite=lax`;
						goto('/checkout/step/review');
					}
				} else {
					goto('/checkout/step/review');
				}
			} else {
				isProcessing = false;
			}
		}
	});

	$effect(() => {
		if (browser) {
			try {
				const paymentData = checkoutStorage.getStep('payment', {
					onError: (error) => {
						console.warn('Error loading payment data:', error);
						storageError = 'Could not load saved payment information.';
					}
				});

				if (paymentData) {
					$form.paymentMethod = paymentData.paymentMethod || 'cash_on_delivery';
				}
			} catch (error) {
				console.warn('Failed to load payment data:', error);
				storageError = 'Could not load saved payment information.';
			}
		}
	});
</script>

{#if storageError}
	<div class="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
		<div class="flex items-start">
			<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0" />
			<div class="ml-3">
				<p class="text-sm font-medium">Storage Warning</p>
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

<form method="post" action="?/validatePayment" use:enhance onsubmit={() => (isProcessing = true)}>
	<div class="space-y-6">
		<!-- Payment Method Section -->
		<div>
			<h3 class="text-foreground mb-4 text-lg font-semibold">Payment Method</h3>
			<div class="border-input bg-background rounded-lg border p-4">
				<div class="flex items-start space-x-3">
					<input
						id="cash_on_delivery"
						name="paymentMethod"
						type="radio"
						value="cash_on_delivery"
						bind:group={$form.paymentMethod}
						class="text-primary focus:ring-primary mt-1 h-4 w-4 border-gray-300"
						checked
					/>
					<div class="flex-1">
						<label for="cash_on_delivery" class="text-foreground flex items-center font-medium">
							<Truck class="mr-2 h-5 w-5 text-orange-600" />
							Cash on Delivery
						</label>
						<p class="text-muted-foreground mt-1 text-sm">
							Pay with cash when your order is delivered to your doorstep. No advance payment
							required.
						</p>
						<div class="border-muted bg-muted/50 text-muted-foreground mt-3 rounded-md border p-3">
							<h4 class="text-foreground font-medium">How it works:</h4>
							<ul class="mt-2 space-y-1 text-sm">
								<li>• Your order will be prepared and shipped</li>
								<li>• Pay the delivery person when your package arrives</li>
								<li>• Have exact change ready for faster delivery</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Separator />

		<!-- Action Buttons -->
		<div class="flex justify-between">
			<Button
				type="button"
				variant="outline"
				onclick={() => goto('/checkout/step/shipping')}
				class="cursor-pointer"
			>
				<span class="md:hidden">Back</span>
				<span class="hidden md:inline">Back to Shipping</span>
			</Button>
			<Button type="submit" disabled={$submitting || isProcessing} class="cursor-pointer">
				{#if isProcessing || $submitting}
					<span class="mr-0 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
				{:else}
					Continue to Review
				{/if}
			</Button>
		</div>
	</div>
</form>
