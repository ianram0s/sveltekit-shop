<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Header, Notice } from '$lib/components/layout';

	let { children, data } = $props();
</script>

<ModeWatcher />
<Toaster position="top-center" richColors />

<Notice />

<div class="bg-background flex h-screen flex-col">
	<Header user={data.user} />

	<!-- Main Content -->
	<main class="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>
