<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { profileFormSchema, type ProfileFormInput } from '@/schemas';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { DateInput } from '$lib/components/date-input';

	import { SaveIcon, XIcon, AlertCircleIcon } from '$lib/components/icons';

	let {
		formData,
		onCancel,
		onSuccess
	}: {
		formData: SuperValidated<ProfileFormInput>;
		onCancel: () => void;
		onSuccess?: ((message: string) => void) | undefined;
	} = $props();

	const { form, errors, enhance, submitting } = superForm(formData, {
		validators: zod4Client(profileFormSchema),
		resetForm: false,
		dataType: 'form',
		invalidateAll: true,
		onUpdated: ({ form }) => {
			if (form.message) {
				onSuccess?.(form.message);
			}
		}
	});

	const originalData = formData.data;

	const hasChanges = $derived(
		$form.name !== originalData.name ||
			$form.email !== originalData.email ||
			$form.phone !== originalData.phone ||
			$form.dateOfBirth !== originalData.dateOfBirth
	);
</script>

<form class="space-y-6" method="post" action="?/updateProfile" use:enhance>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label for="name" class="text-foreground mb-2 block text-sm font-medium"> Full Name </label>
			<input
				id="name"
				name="name"
				bind:value={$form.name}
				type="text"
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.name
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="Enter your full name"
			/>
			{#if $errors.name}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircleIcon class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.name}</p>
				</div>
			{/if}
		</div>

		<div>
			<label for="email" class="text-foreground mb-2 block text-sm font-medium">
				Email Address
			</label>
			<input
				id="email"
				name="email"
				bind:value={$form.email}
				type="email"
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.email
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="Enter your email"
			/>
			{#if $errors.email}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircleIcon class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.email}</p>
				</div>
			{/if}
		</div>

		<div>
			<label for="phone" class="text-foreground mb-2 block text-sm font-medium">
				Phone Number
			</label>
			<input
				id="phone"
				name="phone"
				bind:value={$form.phone}
				type="tel"
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {$errors.phone
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="Enter your phone number"
			/>
			{#if $errors.phone}
				<div class="mt-1 flex items-center space-x-1">
					<AlertCircleIcon class="text-destructive h-4 w-4" />
					<p class="text-destructive text-sm">{$errors.phone}</p>
				</div>
			{/if}
		</div>

		<div>
			<label for="dateOfBirth" class="text-foreground mb-2 block text-sm font-medium">
				Date of Birth
			</label>
			<DateInput
				id="dateOfBirth"
				name="dateOfBirth"
				bind:value={$form.dateOfBirth}
				error={$errors.dateOfBirth?.[0] || ''}
				placeholder="dd/mm/yyyy"
			/>
		</div>
	</div>

	<div class="flex items-center space-x-4">
		<button
			type="submit"
			disabled={$submitting || !hasChanges}
			class={cn(buttonVariants({ variant: 'default' }), 'cursor-pointer')}
		>
			{#if $submitting}
				<div
					class="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"
				></div>
			{:else}
				<SaveIcon class="mr-2 h-4 w-4" />
			{/if}
			Save Profile
		</button>
		<button type="button" class={cn(buttonVariants({ variant: 'outline' }), 'cursor-pointer')} onclick={onCancel}>
			<XIcon class="mr-2 h-4 w-4" />
			Cancel
		</button>
	</div>
</form>
