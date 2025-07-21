<script lang="ts">
	import { scale } from 'svelte/transition';

	interface Props {
		sizes: string[];
		selectedSizes: Set<string>;
		onToggleSize: (size: string) => void;
		compact?: boolean;
	}

	let { sizes, selectedSizes, onToggleSize, compact = false }: Props = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each sizes as size, i}
		<button
			type="button"
			class="px-4 py-{compact
				? '1'
				: '2'} rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105 {selectedSizes.has(
				size
			)
				? 'bg-primary text-primary-foreground border-primary'
				: 'bg-muted text-foreground border-border hover:bg-muted/80'} focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none"
			onclick={() => onToggleSize(size)}
			in:scale={{ duration: 200, delay: i * 30, start: 0.8 }}
		>
			{size}
		</button>
	{/each}
</div>
