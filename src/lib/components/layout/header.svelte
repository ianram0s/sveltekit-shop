<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { ThemeSwitcher } from '$lib/components/theme-switcher';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import type { User } from '$lib/server/db/models';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { ShieldIcon } from '$lib/components/icons';

	let { user }: { user: User | null } = $props();

	async function handleSignOut() {
		await authClient.signOut(
			{},
			{
				onSuccess: () => {
					goto('/', { invalidateAll: true });
				}
			}
		);
	}
</script>

<header
	class="border-border sticky top-0 z-10 border-b bg-white/75 shadow-sm backdrop-blur-sm dark:bg-black/75"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- App Name -->
			<div class="flex items-center">
				<a
					href="/"
					class="text-foreground hover:text-muted-foreground font-integral text-xl font-bold"
				>
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
							<Avatar class="h-8 w-8 cursor-pointer">
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
							{#if user.role === 'admin' || user.role === 'owner'}
								<DropdownMenuItem>
									<a href="/admin" class="flex w-full items-center">
										<ShieldIcon class="mr-2 h-4 w-4" />
										Admin Panel
									</a>
								</DropdownMenuItem>
							{/if}
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
						class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
					>
						Sign In
					</a>
				{/if}
			</div>
		</div>
	</div>
</header>
