<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ProfileForm, AddressForm } from '../_forms';
	import { EditIcon } from '$lib/components/icons';
	import {
		UserIcon,
		MailIcon,
		PhoneIcon,
		MapPinIcon,
		CalendarIcon
	} from '$lib/components/icons';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let isEditing: 'profile' | 'address' | 'all' | null = $state(null);

	function handleSuccess(message: string, type: 'profile' | 'address') {
		toast.success(message);
		if (isEditing === type || isEditing === 'all') {
			isEditing = null;
		}
	}

	function formatDateForDisplay(dateValue: any): string | undefined {
		if (!dateValue) return undefined;
		
		try {
			const date = new Date(dateValue);
			if (!isNaN(date.getTime())) {
				const day = String(date.getUTCDate()).padStart(2, '0');
				const month = String(date.getUTCMonth() + 1).padStart(2, '0');
				const year = date.getUTCFullYear();
				return `${day}/${month}/${year}`;
			}
		} catch (error) {
			console.error('Error formatting date:', error);
		}
		
		return undefined;
	}

	function formatDate(dateString: string | Date | null | undefined) {
		if (!dateString) return 'Not informed';
		try {
			const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
			if (isNaN(date.getTime())) return 'Not informed';
			const day = String(date.getUTCDate()).padStart(2, '0');
			const month = String(date.getUTCMonth() + 1).padStart(2, '0');
			const year = date.getUTCFullYear();
			return `${day}/${month}/${year}`;
		} catch (error) {
			return 'Not informed';
		}
	}
</script>

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
							<p class="text-foreground font-medium">{data.user?.phone || 'Not informed'}</p>
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