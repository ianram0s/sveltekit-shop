<script lang="ts">
    import { fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { buttonVariants } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge';
    import { cn } from '$lib/utils';
    import { PackageIcon, CalendarIcon, ArrowRightIcon } from '$lib/components/icons';

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
            month: 'short',
            day: 'numeric',
        });
    }

    const orders = $derived(data.orders ?? []);
</script>

<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
    <div class="flex items-center justify-between">
        <h2 class="text-foreground text-2xl font-semibold">Order History</h2>
    </div>

    {#if orders.length === 0}
        <div class="bg-card border-border rounded-lg border p-12 text-center">
            <PackageIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 class="text-foreground mb-2 text-xl font-semibold">No Orders Yet</h3>
            <p class="text-muted-foreground mb-6">
                You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <a href="/" class={cn(buttonVariants({ variant: 'default' }), 'cursor-pointer')}>Start Shopping</a>
        </div>
    {:else}
        <div class="space-y-4">
            {#each orders as order}
                <a
                    href={`/my-account/orders/${order.id}`}
                    class="bg-card border-border hover:bg-accent/50 block cursor-pointer rounded-lg border p-4 transition-colors"
                >
                    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md"
                            >
                                <PackageIcon class="h-5 w-5" />
                            </div>
                            <div>
                                <div class="text-foreground flex items-center gap-2 text-sm md:text-base">
                                    <span class="font-semibold">{order.orderNumber}</span>
                                    <span class="text-muted-foreground">•</span>
                                    <span>{formatDate(order.createdAt)}</span>
                                </div>
                                <div class="text-muted-foreground text-xs md:text-sm">
                                    Total: <span class="text-foreground font-medium">{formatCurrency(order.total)}</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 md:gap-4">
                            <Badge variant="outline" class="capitalize">{order.status}</Badge>
                            <ArrowRightIcon class="text-muted-foreground hidden h-4 w-4 md:block" />
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
