<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let isLogin = $state(true);
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold text-gray-900">
				{isLogin ? 'Sign in to your account' : 'Create your account'}
			</h2>
			<p class="mt-2 text-sm text-gray-600">
				{isLogin ? "Don't have an account?" : 'Already have an account?'}
				<button
					type="button"
					class="font-medium text-blue-600 hover:text-blue-500"
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
					<label for="username" class="block text-sm font-medium text-gray-700">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter your username"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter your password"
					/>
				</div>
			</div>

			<button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
			>
				{isLogin ? 'Sign in' : 'Create account'}
			</button>
		</form>

		{#if form?.message}
			<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
				<p class="text-sm text-red-600">{form.message}</p>
			</div>
		{/if}
	</div>
</div> 