<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { CheckCircle, Home, Package, Mail, ArrowRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const actualOrder = $derived(() => {
		if (!data?.order) return null;
		if ('order' in data.order) {
			return data.order.order;
		}
		return data.order;
	});

	const orderNumber = $derived(() => actualOrder()?.orderNumber || 'ORDER-CONFIRMED');

	const estimatedDelivery = $derived(() => {
		const deliveryDate = new Date();
		deliveryDate.setDate(deliveryDate.getDate() + 7);
		return deliveryDate.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	});

	function handleContinueShopping() {
		goto('/');
	}

	function handleViewOrders() {
		goto('/my-account');
	}
</script>

<svelte:head>
	<title>Order Confirmed - Store</title>
	<meta name="description" content="Your order has been confirmed" />
</svelte:head>

<div class="py-1" in:fade={{ duration: 300 }}>
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<!-- Success Header -->
		<div class="mb-12 text-center">
			<div
				class="bg-primary/10 text-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
			>
				<CheckCircle class="h-10 w-10" />
			</div>
			<h1 class="text-foreground mb-4 text-3xl font-bold">Thank you for your order!</h1>
			<p class="text-muted-foreground text-lg">
				Your order has been successfully placed and is being processed.
			</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Order Details -->
			<div class="bg-card border-border rounded-lg border p-6">
				<h2 class="mb-4 text-xl font-semibold">Order Details</h2>

				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-muted-foreground">Order Number</span>
						<span class="font-medium">{orderNumber()}</span>
					</div>

					<div class="flex justify-between">
						<span class="text-muted-foreground">Order Date</span>
						<span class="font-medium"
							>{new Date().toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}</span
						>
					</div>

					<div class="flex justify-between">
						<span class="text-muted-foreground">Estimated Delivery</span>
						<span class="font-medium">{estimatedDelivery()}</span>
					</div>

					<div class="flex justify-between">
						<span class="text-muted-foreground">Payment Status</span>
						<Badge variant="secondary">Cash on Delivery</Badge>
					</div>
				</div>

				<Separator class="my-6" />

				<div class="space-y-3">
					<h3 class="font-semibold">What's Next?</h3>
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<Mail class="text-primary mt-0.5 h-5 w-5" />
							<div>
								<p class="font-medium">Order Confirmation Email</p>
								<p class="text-muted-foreground text-sm">
									You'll receive a confirmation email with your order details shortly.
								</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<Package class="text-primary mt-0.5 h-5 w-5" />
							<div>
								<p class="font-medium">Order Processing</p>
								<p class="text-muted-foreground text-sm">
									We'll start processing your order and prepare it for shipment.
								</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<Package class="text-primary mt-0.5 h-5 w-5" />
							<div>
								<p class="font-medium">Shipping Updates</p>
								<p class="text-muted-foreground text-sm">
									You'll receive tracking information once your order ships.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="space-y-6">
				<div class="bg-card border-border rounded-lg border p-6">
					<h2 class="mb-4 text-xl font-semibold">Need Help?</h2>
					<p class="text-muted-foreground mb-4">
						If you have any questions about your order, our customer support team is here to help.
					</p>

					<div class="space-y-3">
						<div class="flex items-center gap-2 text-sm">
							<Mail class="text-primary h-4 w-4" />
							<span>support@store.com</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<Package class="text-primary h-4 w-4" />
							<span>1-800-STORE-HELP</span>
						</div>
					</div>
				</div>

				<div class="space-y-3">
					<Button onclick={handleContinueShopping} class="w-full cursor-pointer">
						<Home class="mr-2 h-4 w-4" />
						Continue Shopping
					</Button>

					<Button variant="outline" onclick={handleViewOrders} class="w-full cursor-pointer">
						<Package class="mr-2 h-4 w-4" />
						View My Orders
					</Button>
				</div>

				<!-- Quick Links -->
				<div class="bg-muted/50 rounded-lg p-4">
					<h3 class="mb-3 font-semibold">Quick Links</h3>
					<div class="space-y-2">
						<a
							href="/my-account"
							class="hover:text-primary flex items-center justify-between text-sm transition-colors"
						>
							<span>My Account</span>
							<ArrowRight class="h-3 w-3" />
						</a>
						<a
							href="/help"
							class="hover:text-primary flex items-center justify-between text-sm transition-colors"
						>
							<span>Help Center</span>
							<ArrowRight class="h-3 w-3" />
						</a>
						<a
							href="/returns"
							class="hover:text-primary flex items-center justify-between text-sm transition-colors"
						>
							<span>Returns & Exchanges</span>
							<ArrowRight class="h-3 w-3" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
