<script lang="ts">
    import { superForm, type SuperValidated } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { shippingFormSchema, type ShippingFormInput } from '@/schemas';
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import { AlertCircle } from '@lucide/svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { checkoutStorage } from '$lib/storage/checkoutStorage';

    let {
        formData,
    }: {
        formData: SuperValidated<ShippingFormInput>;
    } = $props();

    let storageError = $state<string | null>(null);
    let isProcessing = $state(false);

    const { form, errors, enhance, submitting } = superForm(formData, {
        validators: zod4Client(shippingFormSchema),
        resetForm: false,
        dataType: 'form',
        onUpdated: ({ form }) => {
            if (form.valid) {
                if (browser) {
                    const success = checkoutStorage.updateStep('shipping', form.data, {
                        onError: (error) => {
                            console.error('Failed to save shipping data:', error);
                            storageError = 'Failed to save shipping information. Please try again.';
                            isProcessing = false;
                        },
                    });

                    if (success) {
                        const checkoutData = checkoutStorage.get();
                        document.cookie = `checkout_progress=${encodeURIComponent(JSON.stringify(checkoutData))}; path=/; max-age=86400; samesite=lax`;
                        goto('/checkout/step/payment');
                    }
                } else {
                    goto('/checkout/step/payment');
                }
            } else {
                isProcessing = false;
            }
        },
    });

    $effect(() => {
        if (browser) {
            try {
                const shippingData = checkoutStorage.getStep('shipping', {
                    onError: (error) => {
                        console.warn('Error loading shipping data:', error);
                        storageError = 'Could not load saved shipping information.';
                    },
                });

                if (shippingData) {
                    $form.address = shippingData.address || '';
                    $form.city = shippingData.city || '';
                    $form.state = shippingData.state || '';
                    $form.zipCode = shippingData.zipCode || '';
                    $form.country = shippingData.country || 'US';
                    $form.shippingMethod = shippingData.shippingMethod || 'standard';
                }
            } catch (error) {
                console.warn('Failed to load shipping data:', error);
                storageError = 'Could not load saved shipping information.';
            }
        }
    });

    const shippingMethods = [
        { id: 'standard', name: 'Standard Shipping', price: 15.0, days: '5-7 business days' },
        { id: 'express', name: 'Express Shipping', price: 25.0, days: '2-3 business days' },
        { id: 'overnight', name: 'Overnight Shipping', price: 45.0, days: '1 business day' },
    ];

    const countries = [
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'UK', name: 'United Kingdom' },
        { code: 'AU', name: 'Australia' },
    ];
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

<form method="post" action="?/validateShipping" use:enhance onsubmit={() => (isProcessing = true)}>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
            <label for="address" class="text-foreground mb-2 block text-sm font-medium">Street Address *</label>
            <input
                id="address"
                name="address"
                bind:value={$form.address}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.address
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="123 Main St"
            />
            {#if $errors.address}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircle class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.address}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="city" class="text-foreground mb-2 block text-sm font-medium">City *</label>
            <input
                id="city"
                name="city"
                bind:value={$form.city}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.city
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="New York"
            />
            {#if $errors.city}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircle class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.city}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="state" class="text-foreground mb-2 block text-sm font-medium">State *</label>
            <input
                id="state"
                name="state"
                bind:value={$form.state}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.state
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="Enter state or province"
            />
            {#if $errors.state}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircle class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.state}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="zipCode" class="text-foreground mb-2 block text-sm font-medium">ZIP Code *</label>
            <input
                id="zipCode"
                name="zipCode"
                bind:value={$form.zipCode}
                type="text"
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.zipCode
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input'}"
                placeholder="10001"
            />
            {#if $errors.zipCode}
                <div class="mt-1 flex items-center space-x-1">
                    <AlertCircle class="text-destructive h-4 w-4" />
                    <p class="text-destructive text-sm">{$errors.zipCode}</p>
                </div>
            {/if}
        </div>

        <div>
            <label for="country" class="text-foreground mb-2 block text-sm font-medium">Country</label>
            <select
                id="country"
                name="country"
                bind:value={$form.country}
                class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground border-input w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
            >
                {#each countries as country}
                    <option value={country.code}>{country.name}</option>
                {/each}
            </select>
        </div>
    </div>

    <Separator class="my-6" />

    <div>
        <label class="text-foreground mb-2 block text-sm font-medium">Shipping Method</label>
        <div class="mt-2 space-y-2">
            {#each shippingMethods as method}
                <label
                    class="border-border hover:bg-accent flex cursor-pointer items-center justify-between rounded-lg border p-4"
                >
                    <div class="flex items-center gap-3">
                        <input
                            type="radio"
                            name="shippingMethod"
                            bind:group={$form.shippingMethod}
                            value={method.id}
                            class="text-primary"
                        />
                        <div>
                            <div class="font-medium">{method.name}</div>
                            <div class="text-muted-foreground text-sm">{method.days}</div>
                        </div>
                    </div>
                    <div class="font-medium">${method.price.toFixed(2)}</div>
                </label>
            {/each}
        </div>
    </div>

    <div class="mt-8 flex justify-between">
        <Button type="button" variant="outline" onclick={() => goto('/checkout/step/customer')} class="cursor-pointer">
            <span class="md:hidden">Back</span>
            <span class="hidden md:inline">Back to Customer Info</span>
        </Button>
        <Button
            type="submit"
            disabled={$submitting || isProcessing}
            class="bg-primary text-primary-foreground flex cursor-pointer items-center justify-center"
        >
            {#if isProcessing || $submitting}
                <span class="mr-0 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
            {:else}
                Continue to Payment
            {/if}
        </Button>
    </div>
</form>
