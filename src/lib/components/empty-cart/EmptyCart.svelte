<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ShoppingBag } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let { title = 'Your cart is empty' } = $props();

	function handleContinueShopping() {
		goto('/');
	}
</script>

<div class="flex flex-col items-center justify-center py-16 text-center">
	<ShoppingBag class="text-muted-foreground mb-4 h-16 w-16" />
	<h2 class="text-foreground mb-2 text-xl font-semibold">{title}</h2>
	<p class="text-muted-foreground mb-6 max-w-md">
		Looks like you haven't added any items to your cart yet.
	</p>
	<Button onclick={handleContinueShopping} size="lg" class="cursor-pointer">Start Shopping</Button>
</div>
