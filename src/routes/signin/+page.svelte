<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';

	let { form }: { form: ActionData } = $props();
	let isLogin = $state(true);
	let showPassword = $state(false);
</script>

<div class="h-full flex items-center justify-center">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold text-foreground font-integral">
				{isLogin ? 'Sign in to your account' : 'Create your account'}
			</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				{isLogin ? "Don't have an account?" : 'Already have an account?'}
				<button
					type="button"
					class="font-medium text-primary hover:text-primary/80"
					onclick={() => (isLogin = !isLogin)}
				>
					{isLogin ? 'Sign up' : 'Sign in'}
				</button>
			</p>
		</div>

		<form 
			method="post" 
			action={isLogin ? '?/login' : '?/register'} 
			use:enhance 
			class="space-y-6"
		>
			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-foreground">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						class="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
						placeholder="Enter your email"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-foreground">
						Password
					</label>
					<div class="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
							class="mt-1 block w-full px-3 py-2 pr-10 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
							placeholder="Enter your password"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOffIcon class="h-5 w-5 text-muted-foreground hover:text-foreground" />
							{:else}
								<EyeIcon class="h-5 w-5 text-muted-foreground hover:text-foreground" />
							{/if}
						</button>
					</div>
				</div>
			</div>

			<button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
			>
				{isLogin ? 'Sign in' : 'Create account'}
			</button>
		</form>

		{#if form?.message}
			<div class="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
				<p class="text-sm text-destructive">{form.message}</p>
			</div>
		{/if}
	</div>
</div> 