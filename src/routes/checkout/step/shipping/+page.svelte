<script lang="ts">
    import { MapPin, AlertCircle } from '@lucide/svelte';
    import { Button } from '$lib/components/ui/button';
    import ShippingForm from '../_forms/shipping.svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { checkoutStorage } from '$lib/storage/checkoutStorage';

    let { data } = $props();

    const hasCustomerData = $derived(() => {
        if (browser) {
            try {
                const customerData = checkoutStorage.getStep('customer');
                return !!customerData;
            } catch (error) {
                console.warn('Error checking customer data:', error);
                return false;
            }
        }
        return false;
    });
</script>

<div class="space-y-6">
    <div class="flex items-center gap-2">
        <MapPin class="text-primary h-5 w-5" />
        <h2 class="text-xl font-semibold">Shipping Information</h2>
    </div>

    {#if !hasCustomerData()}
        <div class="bg-muted/50 border-border rounded-lg border p-6">
            <div class="space-y-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <AlertCircle class="text-primary h-5 w-5" />
                    <h3 class="text-lg font-medium">Complete Customer Information First</h3>
                </div>
                <p class="text-muted-foreground text-sm">
                    Please complete the customer information step before proceeding to shipping.
                </p>
                <Button
                    onclick={() => goto('/checkout/step/customer')}
                    class="bg-primary text-primary-foreground cursor-pointer"
                >
                    Go to Customer Information
                </Button>
            </div>
        </div>
    {:else}
        <ShippingForm formData={data.shippingForm} />
    {/if}
</div>
