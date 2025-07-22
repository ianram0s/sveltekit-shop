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
	import { ChevronDown, Menu } from '@lucide/svelte';

	let { user, noticeVisible }: { user: User | null; noticeVisible: boolean } = $props();

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
	class="border-border transition-top fixed right-0 left-0 z-40 border-b bg-white/75 shadow-sm backdrop-blur-sm duration-200 dark:bg-black/75"
	style="top: {noticeVisible ? '2rem' : '0'}"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-8">
				<button
					class="text-muted-foreground hover:text-foreground md:hidden rounded-md p-2 transition-colors"
					onclick={() => {
						window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
					}}
				>
					<Menu class="h-5 w-5" />
				</button>

				<a
					href="/"
					class="text-foreground hover:text-muted-foreground font-integral text-xl font-bold"
				>
					DEMO STORE
				</a>

				<!-- Desktop Navigation -->
				<nav class="hidden items-center gap-6 md:flex">
					<a
						href="/new-arrivals"
						class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
					>
						New Arrivals
					</a>

					<!-- Tops Dropdown -->
					<DropdownMenu>
						<DropdownMenuTrigger
							class="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors duration-200"
						>
							Tops
							<ChevronDown class="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<a href="/shirt" class="w-full">Shirt</a>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<a href="/t-shirt" class="w-full">T-Shirt</a>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<!-- Bottoms -->
					<a
						href="/bottoms"
						class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
					>
						Bottoms
					</a>
				</nav>
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
