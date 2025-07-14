<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { goto } from "$app/navigation";
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import type { User } from "$lib/types";
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	let { user }: { user: User | null } = $props();

	async function handleSignOut() {
		await authClient.signOut({}, {
			onSuccess: () => {
				goto("/", { invalidateAll: true });
			}
		});
	}
</script>

<header class="bg-white/75 dark:bg-black/75 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-10">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- App Name -->
			<div class="flex items-center">
				<a href="/" class="text-xl font-bold text-foreground hover:text-muted-foreground font-integral">
					DEMO STORE
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
							<Avatar class="w-8 h-8 cursor-pointer">
								{#if user.image}
									<AvatarImage src={user.image} alt={user.name || user.email} />
								{/if}
								<AvatarFallback class="bg-primary text-primary-foreground">
									<span>
										{user.email.charAt(0).toUpperCase()}
									</span>
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								{user.email}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<a href="/my-account" class="w-full">My Account</a>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive" onclick={handleSignOut}>
								Sign out
							</DropdownMenuItem>
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