<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { PackageIcon } from '$lib/components/icons';
</script>

<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
	<div class="flex items-center justify-between">
		<h2 class="text-foreground text-2xl font-semibold">Order History</h2>
	</div>

	<div class="bg-card border-border rounded-lg border p-12 text-center">
		<PackageIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
		<h3 class="text-foreground mb-2 text-xl font-semibold">No Orders Yet</h3>
		<p class="text-muted-foreground mb-6">
			You haven't placed any orders yet. Start shopping to see your order history here.
		</p>
		<a href="/" class={cn(buttonVariants({ variant: 'default' }))}> Start Shopping </a>
	</div>
</div> 