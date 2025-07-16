<script lang="ts">
	import { XIcon } from '$lib/components/icons';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let visible = $state(false);

	onMount(() => {
		setTimeout(() => (visible = true), 600);
	});
</script>

{#if visible}
	<div
		class="relative w-full bg-black px-0 py-2 text-white dark:bg-white dark:text-black"
		in:slide={{ duration: 350 }}
		out:slide={{ duration: 200 }}
	>
		<div class="relative mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
			<span class="mx-auto text-sm font-medium">
				Welcome! This is a work in progress, check out the source code on
				<a href="https://github.com/ianram0s/store-sveltekit" class="text-blue-500">GitHub</a> 🤖
			</span>
			<button
				class="hover:text-destructive absolute top-1/2 right-2 -translate-y-1/2 text-white dark:text-black"
				aria-label="Close notice"
				onclick={() => (visible = false)}
			>
				<XIcon class="h-5 w-5" />
			</button>
		</div>
	</div>
{/if}
