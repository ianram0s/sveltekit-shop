<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import ProfileForm from '$lib/components/forms/ProfileForm.svelte';
	import AddressForm from '$lib/components/forms/AddressForm.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import UserIcon from '@lucide/svelte/icons/user';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import PackageIcon from '@lucide/svelte/icons/package';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import EditIcon from '@lucide/svelte/icons/edit-3';
	import ClockIcon from '@lucide/svelte/icons/clock';

	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let activeTab = $state('profile');
	let isEditing: 'profile' | 'address' | 'all' | null = $state(null);
	let showSignOutDialog = $state(false);

	const tabs = [
		{ id: 'profile', label: 'Profile', icon: UserIcon },
		{ id: 'orders', label: 'Orders', icon: PackageIcon },
		{ id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
		{ id: 'settings', label: 'Settings', icon: SettingsIcon }
	];

	function handleSuccess(message: string, type: 'profile' | 'address') {
		toast.success(message);
		if (isEditing === type || isEditing === 'all') {
			isEditing = null;
		}
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

	function formatDate(dateString: string | Date | null | undefined) {
		if (!dateString) return 'Not set';
		try {
			const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
			if (isNaN(date.getTime())) return 'Not set';
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch (error) {
			return 'Not set';
		}
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
						<button
							class={cn(
								'flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all duration-200',
								activeTab === tab.id
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground hover:bg-accent'
							)}
							onclick={() => (activeTab = tab.id)}
						>
							<Icon class="h-5 w-5" />
							<span class="font-medium">{tab.label}</span>
						</button>
					{/each}

					<AlertDialog.Root bind:open={showSignOutDialog}>
						<AlertDialog.Trigger
							class="text-muted-foreground hover:text-foreground hover:bg-accent flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all duration-200"
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
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<AlertDialog.Action onclick={handleSignOut}>Sign Out</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</nav>
			</div>

			<!-- Main Content -->
			<div class="lg:col-span-3">
				{#if activeTab === 'profile'}
					<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
						<div class="flex items-center justify-between">
							<h2 class="text-foreground text-2xl font-semibold">Profile</h2>
						</div>

						<div class="bg-card border-border rounded-lg border p-6">
							<!-- User Profile Section -->
							<div class="mb-8">
								<div class="mb-2 flex items-center justify-between">
									<h3 class="text-foreground text-lg font-medium">Personal Information</h3>
									{#if !isEditing || isEditing !== 'profile'}
										<button
											class={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
											onclick={() => (isEditing = 'profile')}
										>
											<EditIcon class="mr-2 h-4 w-4" />
											Edit Profile
										</button>
									{/if}
								</div>

								{#if isEditing === 'profile'}
									<ProfileForm
										formData={data.profileForm}
										onCancel={() => (isEditing = null)}
										onSuccess={(msg) => handleSuccess(msg, 'profile')}
									/>
								{:else}
									<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div class="flex items-center space-x-3">
											<UserIcon class="text-muted-foreground h-5 w-5" />
											<div>
												<p class="text-muted-foreground text-sm">Full Name</p>
												<p class="text-foreground font-medium">{data.user?.name}</p>
											</div>
										</div>
										<div class="flex items-center space-x-3">
											<MailIcon class="text-muted-foreground h-5 w-5" />
											<div>
												<p class="text-muted-foreground text-sm">Email Address</p>
												<p class="text-foreground font-medium">{data.user?.email}</p>
											</div>
										</div>
										<div class="flex items-center space-x-3">
											<PhoneIcon class="text-muted-foreground h-5 w-5" />
											<div>
												<p class="text-muted-foreground text-sm">Phone Number</p>
												<p class="text-foreground font-medium">{data.user?.phone || 'Not set'}</p>
											</div>
										</div>
										<div class="flex items-center space-x-3">
											<CalendarIcon class="text-muted-foreground h-5 w-5" />
											<div>
												<p class="text-muted-foreground text-sm">Date of Birth</p>
												<p class="text-foreground font-medium">
													{formatDate(data.user?.dateOfBirth)}
												</p>
											</div>
										</div>
									</div>
								{/if}
							</div>

							<!-- Address Section -->
							<div class="border-border mt-8 border-t pt-8">
								<div class="mb-2 flex items-center justify-between">
									<h3 class="text-foreground text-lg font-medium">Shipping Address</h3>
									{#if !isEditing || isEditing !== 'address'}
										<button
											class={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
											onclick={() => (isEditing = 'address')}
										>
											<EditIcon class="mr-2 h-4 w-4" />
											Edit Address
										</button>
									{/if}
								</div>

								{#if isEditing === 'address'}
									<AddressForm
										formData={data.addressForm}
										onCancel={() => (isEditing = null)}
										onSuccess={(msg) => handleSuccess(msg, 'address')}
									/>
								{:else}
									<div class="flex items-start space-x-3">
										<MapPinIcon class="text-muted-foreground mt-0.5 h-5 w-5" />
										<div>
											{#if data.userAddresses[0]?.street}
												<p class="text-foreground font-medium">{data.userAddresses[0].street}</p>
												<p class="text-muted-foreground">
													{data.userAddresses[0].city}, {data.userAddresses[0].state}
													{data.userAddresses[0].zipCode}
												</p>
												<p class="text-muted-foreground">{data.userAddresses[0].country}</p>
											{:else}
												<p class="text-muted-foreground font-medium">No address set</p>
												<p class="text-muted-foreground text-sm">
													Add an address to enable shipping
												</p>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				{#if activeTab === 'orders'}
					<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
						<div class="flex items-center justify-between">
							<h2 class="text-foreground text-2xl font-semibold">Order History</h2>
						</div>

						<div class="bg-card border-border rounded-lg border p-12 text-center">
							<PackageIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
							<h3 class="text-foreground mb-2 text-xl font-semibold">No Orders Yet</h3>
							<p class="text-muted-foreground mb-6">
								You haven't placed any orders yet. Start shopping to see your order history here.
							</p>
							<a href="/" class={cn(buttonVariants({ variant: 'default' }))}> Start Shopping </a>
						</div>
					</div>
				{/if}

				{#if activeTab === 'wishlist'}
					<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
						<div class="flex items-center justify-between">
							<h2 class="text-foreground text-2xl font-semibold">My Wishlist</h2>
						</div>

						<div class="bg-card border-border rounded-lg border p-12 text-center">
							<HeartIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
							<h3 class="text-foreground mb-2 text-xl font-semibold">Under Construction</h3>
							<p class="text-muted-foreground mb-6">
								The wishlist feature is coming soon! You'll be able to save your favorite products
								and track them here.
							</p>
							<div class="text-muted-foreground flex items-center justify-center space-x-2 text-sm">
								<ClockIcon class="h-4 w-4" />
								<span>Coming soon</span>
							</div>
						</div>
					</div>
				{/if}

				{#if activeTab === 'settings'}
					<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
						<h2 class="text-foreground text-2xl font-semibold">Account Settings</h2>

						<div class="bg-card border-border rounded-lg border p-12 text-center">
							<SettingsIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
							<h3 class="text-foreground mb-2 text-xl font-semibold">Under Construction</h3>
							<p class="text-muted-foreground mb-6">
								Account settings are coming soon! You'll be able to manage your password,
								notifications, and other preferences here.
							</p>
							<div class="text-muted-foreground flex items-center justify-center space-x-2 text-sm">
								<ClockIcon class="h-4 w-4" />
								<span>Coming soon</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
