<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { ChevronRight } from '@lucide/svelte';

	interface Props {
		title: string;
		isOpen: boolean;
		onToggle: () => void;
		children: import('svelte').Snippet;
	}

	let { title, isOpen, onToggle, children }: Props = $props();
</script>

<div class="mb-2">
	<button
		class="text-foreground flex w-full items-center justify-between rounded-md py-2 font-semibold transition-colors duration-200"
		onclick={onToggle}
	>
		<span>{title}</span>
		<div class="transition-transform duration-300 {isOpen ? 'rotate-90' : ''}">
			<ChevronRight class="h-4 w-4" />
		</div>
	</button>
	{#if isOpen}
		<div class="mb-4" in:slide={{ duration: 300, easing: quintOut }} out:slide={{ duration: 200 }}>
			{@render children()}
		</div>
	{/if}
</div>
