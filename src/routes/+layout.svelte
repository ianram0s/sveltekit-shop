<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="h-screen bg-background flex flex-col">
	<Header />

	<!-- Main Content -->
	<main class="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>