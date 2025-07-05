<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';

	let { children, data }: { children: any; data: LayoutServerData } = $props();
</script>

<ModeWatcher />

<div class="h-screen bg-background flex flex-col">
	<Header user={data.user} />

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		{@render children()}
	</main>
</div>