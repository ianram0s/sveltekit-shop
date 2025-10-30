<script lang="ts">
    import { ShoppingCartIcon } from '$lib/components/icons/index.js';
    import { Badge } from '$lib/components/ui/badge';
    import { cartState } from '@/global-states';
    import { cn } from '$lib/utils.js';

    let {
        class: className,
        size = '24',
        showBadge = true,
        ...restProps
    }: {
        class?: string;
        size?: string;
        showBadge?: boolean;
    } = $props();
</script>

<div class={cn('relative inline-flex', className)} {...restProps}>
    <ShoppingCartIcon {size} />

    {#if showBadge && cartState.totalItems > 0}
        <Badge variant="default" class="absolute -top-3 -right-2 h-5 w-5 min-w-5 rounded-full p-0 text-xs">
            {cartState.totalItems > 99 ? '99' : cartState.totalItems}
        </Badge>
    {/if}
</div>
