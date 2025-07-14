<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { goto } from '$app/navigation';
	import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '$lib/schemas';

	let isLogin = $state(true);
	let showPassword = $state(false);
	let isLoading = $state(false);
	let isGoogleLoading = $state(false);
	let errors = $state<Record<string, string>>({});
	let serverError = $state('');

	let email = $state('');
	let password = $state('');
	let name = $state('');

	function validateForm(): { isValid: boolean; errors: Record<string, string> } {
		const formData = isLogin
			? ({ email, password } as SignInInput)
			: ({ email, password, name } as SignUpInput);

		const schema = isLogin ? signInSchema : signUpSchema;
		const result = schema.safeParse(formData);

		if (result.success) {
			return { isValid: true, errors: {} };
		}

		const fieldErrors: Record<string, string> = {};
		result.error.issues.forEach((issue) => {
			const field = issue.path[0] as string;
			fieldErrors[field] = issue.message;
		});

		return { isValid: false, errors: fieldErrors };
	}

	function getErrorMessage(error: any, isLogin: boolean): string {
		if (!error?.message) {
			return 'An unexpected error occurred. Please try again later.';
		}

		const errorMessages = {
			signIn: {
				invalid: 'Invalid email or password. Please check your credentials and try again.',
				'user not found': 'No account found with this email address. Please sign up first.',
				'many attempts': 'Too many login attempts. Please try again later.'
			},
			signUp: {
				'already exists': 'An account with this email already exists. Please sign in instead.',
				duplicate: 'An account with this email already exists. Please sign in instead.',
				'weak password':
					'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.',
				'password requirements':
					'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.'
			}
		};

		const errorMessage = error.message.toLowerCase();
		const messages = isLogin ? errorMessages.signIn : errorMessages.signUp;

		for (const [pattern, message] of Object.entries(messages)) {
			if (errorMessage.includes(pattern)) {
				return message;
			}
		}

		return error.message;
	}

	async function handleSubmit() {
		const validation = validateForm();

		if (!validation.isValid) {
			errors = validation.errors;
			return;
		}

		isLoading = true;
		serverError = '';
		errors = {};

		const authResult = isLogin
			? await authClient.signIn.email({ email, password })
			: await authClient.signUp.email({ email, password, name });

		if (authResult.error) {
			serverError = getErrorMessage(authResult.error, isLogin);
		} else {
			goto('/', { invalidateAll: true });
		}

		isLoading = false;
	}

	async function handleGoogleSignIn() {
		isGoogleLoading = true;
		serverError = '';

		const authResult = await authClient.signIn.social({
			provider: 'google'
		});

		if (authResult.error) {
			serverError = getErrorMessage(authResult.error, isLogin);
			isGoogleLoading = false;
		}
	}

	function toggleMode() {
		isLogin = !isLogin;
		errors = {};
		serverError = '';
	}
</script>

<div class="flex h-full items-center justify-center">
	<div class="w-full max-w-md space-y-8" in:fade={{ duration: 300, easing: quintOut }}>
		<div class="text-center">
			<h2 class="text-foreground font-integral text-3xl font-bold transition-all duration-300">
				{isLogin ? 'Sign in to your account' : 'Create your account'}
			</h2>
			<p class="text-muted-foreground mt-2 text-sm transition-all duration-300">
				{isLogin ? "Don't have an account?" : 'Already have an account?'}
				<button
					type="button"
					class="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
					onclick={toggleMode}
				>
					{isLogin ? 'Sign up' : 'Sign in'}
				</button>
			</p>
		</div>

		{#if serverError}
			<div
				class="bg-destructive/10 border-destructive/20 rounded-lg border p-4"
				transition:slide={{ duration: 300, easing: quintOut }}
			>
				<div class="flex items-center space-x-2">
					<AlertCircleIcon class="text-destructive h-5 w-5 flex-shrink-0" />
					<p class="text-destructive text-sm font-medium">{serverError}</p>
				</div>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Google Sign -->
			<button
				type="button"
				onclick={handleGoogleSignIn}
				disabled={isGoogleLoading}
				class="border-input text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring disabled:hover:bg-background flex w-full transform items-center justify-center rounded-md border px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isGoogleLoading}
					<div
						class="border-foreground/30 border-t-foreground h-5 w-5 animate-spin rounded-full border-2"
					></div>
				{:else}
					<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					<span class="transition-all duration-200">Continue with Google</span>
				{/if}
			</button>

			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="border-input w-full border-t"></div>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background text-muted-foreground px-2">Or continue with email</span>
				</div>
			</div>

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
						{#if errors.name}
							<div class="mt-1 flex items-center space-x-1" transition:fade={{ duration: 200 }}>
								<AlertCircleIcon class="text-destructive h-4 w-4" />
								<p class="text-destructive text-sm">{errors.name}</p>
							</div>
						{/if}
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
					{#if errors.email}
						<div class="mt-1 flex items-center space-x-1" transition:fade={{ duration: 200 }}>
							<AlertCircleIcon class="text-destructive h-4 w-4" />
							<p class="text-destructive text-sm">{errors.email}</p>
						</div>
					{/if}
				</div>

				<div>
					<label for="password" class="text-foreground block text-sm font-medium"> Password </label>
					<div class="relative">
						<input
							id="password"
							bind:value={password}
							type={showPassword ? 'text' : 'password'}
							required
							class="placeholder-muted-foreground focus:ring-ring focus:border-ring bg-background text-foreground mt-1 block w-full rounded-md border px-3 py-2 pr-10 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none {errors.password
								? 'border-destructive focus:border-destructive focus:ring-destructive/20'
								: 'border-input'}"
							placeholder="Enter your password"
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
					{#if errors.password}
						<div class="mt-1 flex items-center space-x-1" transition:fade={{ duration: 200 }}>
							<AlertCircleIcon class="text-destructive h-4 w-4" />
							<p class="text-destructive text-sm">{errors.password}</p>
						</div>
					{/if}
					{#if !isLogin && !errors.password}
						<p
							class="text-muted-foreground mt-1 text-xs transition-all duration-300"
							transition:fade={{ duration: 300 }}
						>
							Password must be at least 8 characters with uppercase, lowercase, and number
						</p>
					{/if}
				</div>
			</div>

			<button
				type="button"
				onclick={handleSubmit}
				disabled={isLoading}
				class="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-ring disabled:hover:bg-primary flex w-full transform justify-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isLoading}
					<div
						class="border-primary-foreground/30 border-t-primary-foreground h-5 w-5 animate-spin rounded-full border-2"
					></div>
				{:else}
					<span class="transition-all duration-200">{isLogin ? 'Sign in' : 'Create account'}</span>
				{/if}
			</button>
		</div>
	</div>
</div>
