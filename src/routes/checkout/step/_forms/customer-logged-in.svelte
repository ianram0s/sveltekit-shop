<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { customerFormSchema, type CustomerFormInput } from '@/schemas';
	import { Button } from '$lib/components/ui/button';
	import { User, AlertCircle } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { checkoutStorage } from '$lib/storage/checkoutStorage';

	let {
		formData,
		user
	}: {
		formData: SuperValidated<CustomerFormInput>;
		user: any;
	} = $props();

	let storageError = $state<string | null>(null);

	const { form, errors, enhance, submitting } = superForm(formData, {
		validators: zod4Client(customerFormSchema),
		resetForm: false,
		dataType: 'form',
		onUpdated: ({ form }) => {
			if (form.valid) {
				if (browser) {
					const success = checkoutStorage.updateStep('customer', form.data, {
						onError: (error) => {
							console.error('Failed to save customer data:', error);
							storageError = 'Failed to save customer information. Please try again.';
						}
					});

					if (success) {
						const checkoutData = checkoutStorage.get();
						document.cookie = `checkout_progress=${encodeURIComponent(JSON.stringify(checkoutData))}; path=/; max-age=86400; samesite=lax`;
						goto('/checkout/step/shipping');
					}
				} else {
					goto('/checkout/step/shipping');
				}
			}
		}
	});

	$effect(() => {
		if (browser) {
			try {
				const customerData = checkoutStorage.getStep('customer', {
					onError: (error) => {
						console.warn('Error loading customer data:', error);
						storageError = 'Could not load saved customer information.';
					}
				});

				if (customerData) {
					$form.firstName = customerData.firstName || '';
					$form.lastName = customerData.lastName || '';
					$form.email = customerData.email || '';
					$form.phone = customerData.phone || '';
				} else if (user) {
					// Use logged-in user data as fallback
					const nameParts = user.name?.split(' ') || [];
					$form.firstName = nameParts[0] || '';
					$form.lastName = nameParts.slice(1).join(' ') || '';
					$form.email = user.email || '';
					$form.phone = user.phone || '';
				}
			} catch (error) {
				console.warn('Failed to load customer data:', error);
				storageError = 'Could not load saved customer information.';

				// Use logged-in user data as fallback
				if (user) {
					const nameParts = user.name?.split(' ') || [];
					$form.firstName = nameParts[0] || '';
					$form.lastName = nameParts.slice(1).join(' ') || '';
					$form.email = user.email || '';
					$form.phone = user.phone || '';
				}
			}
		}
	});
</script>

<!-- User Info Display -->
<div class="bg-muted/50 border-border mb-6 rounded-lg border p-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<User class="text-primary h-5 w-5" />
			<div>
				<p class="font-medium">{user.name}</p>
				<p class="text-muted-foreground text-sm">{user.email}</p>
			</div>
		</div>
		<Button
			variant="outline"
			size="sm"
			onclick={() => goto('/my-account/profile')}
			class="cursor-pointer"
		>
			Edit Profile
		</Button>
	</div>
</div>

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

<!-- Customer Form -->
<form method="post" action="?/validateCustomer" use:enhance>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label for="firstName" class="text-foreground mb-2 block text-sm font-medium"
				>First Name *</label
			>
			<input
				id="firstName"
				name="firstName"
				bind:value={$form.firstName}
				type="text"
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.firstName
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="John"
			/>
			{#if $errors.firstName}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircle class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.firstName}</p>
				</div>
			{/if}
		</div>

		<div>
			<label for="lastName" class="text-foreground mb-2 block text-sm font-medium"
				>Last Name *</label
			>
			<input
				id="lastName"
				name="lastName"
				bind:value={$form.lastName}
				type="text"
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.lastName
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="Doe"
			/>
			{#if $errors.lastName}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircle class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.lastName}</p>
				</div>
			{/if}
		</div>

		<div>
			<label for="email" class="text-foreground mb-2 block text-sm font-medium"
				>Email Address *</label
			>
			<input
				id="email"
				name="email"
				type="email"
				bind:value={$form.email}
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.email
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="john.doe@example.com"
			/>
			{#if $errors.email}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircle class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.email}</p>
				</div>
			{/if}
		</div>

		<div>
			<label for="phone" class="text-foreground mb-2 block text-sm font-medium"
				>Phone Number *</label
			>
			<input
				id="phone"
				name="phone"
				type="tel"
				bind:value={$form.phone}
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.phone
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="(555) 123-4567"
			/>
			{#if $errors.phone}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircle class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.phone}</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-8 flex justify-end">
		<Button
			type="submit"
			disabled={$submitting}
			class="bg-primary text-primary-foreground flex cursor-pointer items-center justify-center"
		>
			{#if $submitting}
				Processing...
			{:else}
				Continue to Shipping
			{/if}
		</Button>
	</div>
</form>
