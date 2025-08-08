<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import {
		UserIcon,
		PackageIcon,
		HeartIcon,
		SettingsIcon,
		LogOutIcon
	} from '$lib/components/icons';

	let { children, data } = $props();

	let showSignOutDialog = $state(false);

	const currentPath = $derived(page.url.pathname);

	const tabs = [
		{ id: 'profile', label: 'Profile', icon: UserIcon, href: '/my-account/profile' },
		{ id: 'orders', label: 'Orders', icon: PackageIcon, href: '/my-account/orders' },
		{ id: 'wishlist', label: 'Wishlist', icon: HeartIcon, href: '/my-account/wishlist' },
		{ id: 'settings', label: 'Settings', icon: SettingsIcon, href: '/my-account/settings' }
	];

	function isActive(href: string): boolean {
		return (
			currentPath === href || (href === '/my-account/profile' && currentPath === '/my-account')
		);
	}

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

<svelte:head>
	<title>My Account - {data.user?.name}</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-foreground font-integral text-3xl font-bold">My Account</h1>
			<p class="text-muted-foreground mt-2">Manage your profile, orders, and preferences</p>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
			<!-- Navigation -->
			<div class="lg:col-span-1">
				<nav class="space-y-2">
					{#each tabs as tab}
						{@const Icon = tab.icon}
						<a
							href={tab.href}
							class={cn(
								'flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all duration-200',
								isActive(tab.href)
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground hover:bg-accent'
							)}
						>
							<Icon class="h-5 w-5" />
							<span class="font-medium">{tab.label}</span>
						</a>
					{/each}

					<AlertDialog.Root bind:open={showSignOutDialog}>
						<AlertDialog.Trigger
						class="text-muted-foreground hover:text-foreground hover:bg-accent flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all duration-200 cursor-pointer"
						>
							<LogOutIcon class="h-5 w-5" />
							<span class="font-medium">Sign Out</span>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Sign Out</AlertDialog.Title>
								<AlertDialog.Description>
									Are you sure you want to sign out? You will need to sign in again to access your
									account.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel class="cursor-pointer">Cancel</AlertDialog.Cancel>
								<AlertDialog.Action class="cursor-pointer" onclick={handleSignOut}>Sign Out</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</nav>
			</div>

			<!-- Main Content -->
			<div class="lg:col-span-3">
				{@render children()}
			</div>
		</div>
	</div>
</div>
