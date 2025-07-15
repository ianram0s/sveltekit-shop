<script lang="ts">
	import { EyeIcon, EyeOffIcon } from '$lib/components/icons';

	let {
		value = $bindable(''),
		placeholder = 'Enter your password',
		id,
		required = false,
		hasError = false,
		class: className = '',
		...props
	}: {
		value?: string;
		placeholder?: string;
		id?: string;
		required?: boolean;
		hasError?: boolean;
		class?: string;
		[key: string]: any;
	} = $props();

	let showPassword = $state(false);
</script>

<div class="relative">
	<input
		{id}
		bind:value
		type={showPassword ? 'text' : 'password'}
		{required}
		class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground mt-1 block w-full rounded-md border px-3 py-2 pr-10 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {hasError
			? 'border-destructive focus:border-destructive focus:ring-destructive/20'
			: 'border-input'} {className}"
		{placeholder}
		{...props}
	/>
	<button
		type="button"
		class="hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-200"
		onclick={() => (showPassword = !showPassword)}
		tabindex="-1"
	>
		{#if showPassword}
			<EyeOffIcon class="text-muted-foreground h-5 w-5" />
		{:else}
			<EyeIcon class="text-muted-foreground h-5 w-5" />
		{/if}
	</button>
</div>
