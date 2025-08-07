<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { User, Shield } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import CustomerLoggedInForm from '../_forms/customer-logged-in.svelte';
	import CustomerGuestForm from '../_forms/customer-guest.svelte';
	import { checkoutStorage } from '$lib/storage/checkoutStorage';

	let { data } = $props();
	let showGuestForm = $state(false);

	$effect(() => {
		if (browser && !data.user) {
			try {
				const customerData = checkoutStorage.getStep('customer');
				if (customerData) {
					showGuestForm = true;
				}
			} catch (error) {
				console.warn('Error checking customer data:', error);
			}
		}
	});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-2">
		<User class="text-primary h-5 w-5" />
		<h2 class="text-xl font-semibold">Customer Information</h2>
	</div>

	{#if !data.user}
		<!-- Not logged in - Show sign in option -->
		<div class="bg-muted/50 border-border rounded-lg border p-6">
			<div class="space-y-4 text-center">
				<div class="flex items-center justify-center gap-2">
					<Shield class="text-primary h-5 w-5" />
					<h3 class="text-lg font-medium">Sign in to your account</h3>
				</div>
				<p class="text-muted-foreground text-sm">
					Sign in to your account to save your information and track your orders, or continue as a
					guest.
				</p>
				<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button
						onclick={() => goto('/signin?redirect=/checkout/step/customer')}
						class="bg-primary text-primary-foreground cursor-pointer"
					>
						Sign in / Sign up
					</Button>
					<Button variant="outline" onclick={() => (showGuestForm = true)} class="cursor-pointer">
						Continue as Guest
					</Button>
				</div>
			</div>
		</div>

		{#if showGuestForm}
			<div transition:fade={{ duration: 300 }}>
				<CustomerGuestForm formData={data.customerForm} />
			</div>
		{/if}
	{:else}
		<!-- Logged in user -->
		<CustomerLoggedInForm formData={data.customerForm} user={data.user} />
	{/if}
</div>
