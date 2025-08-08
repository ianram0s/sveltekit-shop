<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { X } from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import type { Category } from '$lib/types/product';

	let {
		categories,
		open = $bindable(false)
	}: { categories: Category[]; open?: boolean } = $props();

	const currentPath = $derived(page.url.pathname);

	function isActive(slug: string): boolean {
		return currentPath === `/${slug}`;
	}

	function handleCategoryClick(slug: string) {
		goto(`/${slug}`);
		open = false;
	}

	function handleHomeClick() {
		goto('/');
		open = false;
	}
</script>

<Sheet.Root bind:open={open}>
	<Sheet.Content
		side="left"
		class="bg-sidebar text-sidebar-foreground w-80 p-0 [&>button]:hidden md:hidden"
	>
		<Sheet.Header class="border-border border-b p-4">
			<div class="flex items-center justify-between">
				<a
					href="/"
					class="text-foreground hover:text-muted-foreground font-integral text-xl font-bold"
					onclick={handleHomeClick}
				>
					DEMO STORE
				</a>
				<button
					class="text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors"
					onclick={() => (open = false)}
				>
					<X class="h-5 w-5" />
				</button>
			</div>
		</Sheet.Header>

		<div class="flex h-full w-full flex-col">
			<div class="flex-1 p-4">
				<nav class="space-y-2">
					<!-- Home -->
					<a
						href="/"
						class="flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground {isActive('') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}"
						onclick={handleHomeClick}
					>
						Home
					</a>

					<!-- Categories -->
					{#each categories as category}
						<a
							href="/{category.slug}"
							class="flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground {isActive(category.slug) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}"
							onclick={() => handleCategoryClick(category.slug)}
						>
							{category.name}
						</a>
					{/each}
				</nav>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root> 