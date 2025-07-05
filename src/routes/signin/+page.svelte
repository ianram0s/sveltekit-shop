<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let isLogin = $state(true);
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
					<label for="username" class="block text-sm font-medium text-foreground">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
						placeholder="Enter your username"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-foreground">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
						placeholder="Enter your password"
					/>
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