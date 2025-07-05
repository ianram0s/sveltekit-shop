<script lang="ts">
	import { enhance } from '$app/forms';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	interface User {
		id: string;
		email: string;
	}

	let { user }: { user: User | null } = $props();
</script>

<header class="bg-card shadow-sm border-b border-border sticky top-0 z-10">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- App Name -->
			<div class="flex items-center">
				<a href="/" class="text-xl font-bold text-foreground hover:text-muted-foreground font-integral">
					MyApp
				</a>
			</div>

			<!-- User Section -->
			<div class="flex items-center space-x-4">
				<!-- Theme Switcher -->
				<ThemeSwitcher />
				
				{#if user}
					<!-- User Dropdown Menu -->
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
								<span class="text-primary-foreground text-sm font-medium">
									{user.email.charAt(0).toUpperCase()}
								</span>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								{user.email}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<form method="post" action="/logout" use:enhance>
								<DropdownMenuItem variant="destructive">
									<button type="submit" class="w-full text-left">
										Sign out
									</button>
								</DropdownMenuItem>
							</form>
						</DropdownMenuContent>
					</DropdownMenu>
				{:else}
					<!-- Sign In Button -->
					<a
						href="/signin"
						class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
					>
						Sign In
					</a>
				{/if}
			</div>
		</div>
	</div>
</header> 