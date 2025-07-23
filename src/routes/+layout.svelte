<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Header, Notice, MobileSidebar, Footer } from '$lib/components/layout';
	import { onMount } from 'svelte';

	let { children, data } = $props();
	let noticeVisible = $state(false);

	onMount(() => {
		setTimeout(() => (noticeVisible = true), 600);
	});

	function handleNoticeClose() {
		noticeVisible = false;
	}
</script>

<ModeWatcher />
<Toaster position="top-center" richColors />

<div class="bg-background flex min-h-screen flex-col">
	<Notice {noticeVisible} onClose={handleNoticeClose} />

	<Header user={data.user} {noticeVisible} />

	<MobileSidebar categories={data.categories} />

	<!-- Main Content -->
	<main
		class="transition-padding flex-1 px-4 py-6 duration-200 sm:px-6 lg:px-8"
		style="margin-top: {noticeVisible ? '6rem' : '4rem'}"
	>
		{@render children()}
	</main>

	<Footer />
</div>
