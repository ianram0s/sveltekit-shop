<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { FieldError } from '$lib/components/field-error';
	import { PasswordInput } from '$lib/components/password-input';

	let {
		isLogin,
		email = $bindable(),
		password = $bindable(),
		name = $bindable(),
		errors,
		isLoading,
		onSubmit
	}: {
		isLogin: boolean;
		email: string;
		password: string;
		name: string;
		errors: Record<string, string>;
		isLoading: boolean;
		onSubmit: () => Promise<void>;
	} = $props();
</script>

<div class="space-y-4">
	{#if !isLogin}
		<div transition:slide={{ duration: 400, easing: quintOut }}>
			<label for="name" class="text-foreground block text-sm font-medium"> Name </label>
			<input
				id="name"
				bind:value={name}
				type="text"
				required
				class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground mt-1 block w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {errors.name
					? 'border-destructive focus:border-destructive focus:ring-destructive/20'
					: 'border-input'}"
				placeholder="Enter your full name"
			/>
			<FieldError error={errors.name} />
		</div>
	{/if}

	<div>
		<label for="email" class="text-foreground block text-sm font-medium"> E-mail </label>
		<input
			id="email"
			bind:value={email}
			type="email"
			required
			class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground mt-1 block w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {errors.email
				? 'border-destructive focus:border-destructive focus:ring-destructive/20'
				: 'border-input'}"
			placeholder="Enter your email address"
		/>
		<FieldError error={errors.email} />
	</div>

	<div>
		<label for="password" class="text-foreground block text-sm font-medium"> Password </label>
		<PasswordInput
			id="password"
			bind:value={password}
			required
			hasError={!!errors.password}
			placeholder="Enter your password"
		/>
		<FieldError error={errors.password} />
		{#if !isLogin && !errors.password}
			<p
				class="text-muted-foreground mt-1 text-xs transition-all duration-300"
				transition:slide={{ duration: 300, easing: quintOut }}
			>
				Password must be at least 8 characters with uppercase, lowercase, and number
			</p>
		{/if}
	</div>
</div>

<button
	type="button"
	onclick={onSubmit}
	disabled={isLoading}
    class="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-ring disabled:hover:bg-primary flex w-full transform justify-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
>
	{#if isLoading}
		<div
			class="border-primary-foreground/30 border-t-primary-foreground h-5 w-5 animate-spin rounded-full border-2"
		></div>
	{:else}
		<span class="transition-all duration-200">{isLogin ? 'Sign in' : 'Create account'}</span>
	{/if}
</button>
