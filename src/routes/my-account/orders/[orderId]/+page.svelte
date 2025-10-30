<script lang="ts">
    import { fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { Button } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge';
    import { Separator } from '$lib/components/ui/separator';
    import { PackageIcon, ArrowLeftIcon, CalendarIcon, MapPinIcon } from '$lib/components/icons';
    import { goto } from '$app/navigation';

    let { data } = $props();

    function formatCurrency(value: number | string) {
        const num = Number(value || 0);
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    }

    function formatDate(dateLike?: string | Date) {
        if (!dateLike) return '';
        const d = new Date(dateLike);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    function handleBack() {
        goto('/my-account/orders');
    }

    function formatPaymentMethod(method?: string | null): string {
        if (!method) return '';
        return method
            .split('_')
            .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
            .join(' ');
    }
</script>

<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
            <Button variant="outline" size="sm" onclick={handleBack} class="cursor-pointer gap-2">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to orders
            </Button>
            <h2 class="text-foreground text-xl font-semibold md:text-2xl">
                Order {data.order.order.orderNumber}
            </h2>
        </div>
        <div class="flex items-center gap-2">
            <Badge variant="outline" class="capitalize">{data.order.order.status}</Badge>
        </div>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
        <div class="space-y-4 md:col-span-2">
            <div class="bg-card border-border rounded-lg border">
                <div class="flex items-center justify-between p-4">
                    <div class="text-muted-foreground flex items-center gap-2 text-sm">
                        <CalendarIcon class="h-4 w-4" />
                        <span>Placed on {formatDate(data.order.order.createdAt)}</span>
                    </div>
                    {#if data.order.order.trackingNumber}
                        <div class="text-muted-foreground text-sm">
                            Tracking: <span class="text-foreground font-medium">{data.order.order.trackingNumber}</span>
                        </div>
                    {/if}
                </div>
                <Separator />

                <div class="divide-border divide-y">
                    {#each data.order.items as item}
                        <div class="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                            <div class="flex items-center gap-3">
                                {#if item.productImage}
                                    <img
                                        src={item.productImage}
                                        alt={item.productTitle}
                                        class="bg-muted h-16 w-16 rounded-md object-cover"
                                    />
                                {:else}
                                    <div
                                        class="bg-muted text-muted-foreground flex h-16 w-16 items-center justify-center rounded-md"
                                    >
                                        <PackageIcon class="h-5 w-5" />
                                    </div>
                                {/if}
                                <div>
                                    <a
                                        href={`/product/${item.productSlug}`}
                                        class="text-foreground hover:text-primary block font-medium transition-colors"
                                        >{item.productTitle}</a
                                    >
                                    <div class="text-muted-foreground text-xs">Qty: {item.quantity}</div>
                                </div>
                            </div>
                            <div class="text-foreground font-semibold">{formatCurrency(item.totalPrice)}</div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <div class="bg-card border-border rounded-lg border p-4">
                <h3 class="text-foreground mb-3 text-sm font-semibold">Order Summary</h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Subtotal</span>
                        <span class="text-foreground">{formatCurrency(data.order.order.subtotal ?? 0)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Shipping</span>
                        <span class="text-foreground">{formatCurrency(data.order.order.shipping ?? 0)}</span>
                    </div>
                    <Separator class="my-2" />
                    <div class="flex justify-between text-base font-semibold">
                        <span class="text-foreground">Total</span>
                        <span class="text-foreground">{formatCurrency(data.order.order.total ?? 0)}</span>
                    </div>
                </div>
            </div>

            <div class="bg-card border-border rounded-lg border p-4">
                <h3 class="text-foreground mb-3 text-sm font-semibold">Shipping Address</h3>
                {#if data.order.order.shippingAddress}
                    <div class="text-muted-foreground text-sm leading-6">
                        <div class="text-foreground font-medium">
                            {data.order.order.shippingAddress.firstName}
                            {data.order.order.shippingAddress.lastName}
                        </div>
                        <div>{data.order.order.shippingAddress.address}</div>
                        <div>
                            {data.order.order.shippingAddress.city}, {data.order.order.shippingAddress.state}
                            {data.order.order.shippingAddress.zipCode}
                        </div>
                        <div>{data.order.order.shippingAddress.country}</div>
                    </div>
                {:else}
                    <p class="text-muted-foreground text-sm">No shipping address on file.</p>
                {/if}
            </div>

            <div class="bg-card border-border rounded-lg border p-4">
                <h3 class="text-foreground mb-3 text-sm font-semibold">Payment</h3>
                <div class="text-muted-foreground text-sm">
                    Method: <span class="text-foreground font-medium"
                        >{formatPaymentMethod(data.order.order.paymentMethod) || 'N/A'}</span
                    >
                </div>
                <div class="text-muted-foreground text-sm">
                    Status: <Badge
                        class="ml-1 capitalize"
                        variant={data.order.order.paymentStatus === 'paid' ? 'default' : 'outline'}
                        >{data.order.order.paymentStatus}</Badge
                    >
                </div>
            </div>
        </div>
    </div>
</div>
