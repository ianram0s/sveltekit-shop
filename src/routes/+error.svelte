<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import FileQuestionIcon from '@lucide/svelte/icons/file-question';
	import HomeIcon from '@lucide/svelte/icons/home';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { goto } from '$app/navigation';

	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'Something went wrong');
	
	const errorContent = $derived.by(() => {
		switch (status) {
			case 403:
				return {
					icon: AlertCircleIcon,
					title: 'Unauthorized Access',
					description: message,
					suggestion: 'Please try again or go back to the previous page.'
				};
			case 404:
				return {
					icon: FileQuestionIcon,
					title: 'Page Not Found',
					description:
						'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
					suggestion: 'Please check the URL and try again.'
				};
			case 500:
				return {
					icon: AlertCircleIcon,
					title: 'Internal Server Error',
					description: 'We encountered an unexpected error while processing your request.',
					suggestion: 'Please try again later or contact support if the problem persists.'
				};
			default:
				return {
					icon: AlertCircleIcon,
					title: 'Something went wrong',
					description: message,
					suggestion: 'Please try again or go back to the previous page.'
				};
		}
	});
</script>

<svelte:head>
	<title>{status} - {errorContent.title}</title>
</svelte:head>

<div class="flex min-h-[60vh] items-center justify-center px-4">
	<div class="w-full max-w-md text-center">
		<div class="mb-8">
			<div
				class="bg-destructive/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
			>
				<errorContent.icon class="text-destructive h-12 w-12" />
			</div>

			<h1 class="text-foreground mb-2 text-6xl font-bold">
				{status}
			</h1>

			<h2 class="text-foreground mb-4 text-2xl font-semibold">
				{errorContent.title}
			</h2>

			<p class="text-muted-foreground mb-2 leading-relaxed">
				{errorContent.description}
			</p>

			<p class="text-muted-foreground mb-6 text-sm">
				{errorContent.suggestion}
			</p>

			<div class="flex items-center justify-center gap-4">
				<Button onclick={() => window.history.back()} variant="outline" class="">
					<ArrowLeftIcon class="mr-2 h-4 w-4" />
					Go Back
				</Button>

				<Button onclick={() => goto('/')} class="">
					<HomeIcon class="mr-2 h-4 w-4" />
					Go Home
				</Button>
			</div>
		</div>
	</div>
</div>
