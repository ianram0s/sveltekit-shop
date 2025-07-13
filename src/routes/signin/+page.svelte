<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { slide, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';


	let isLogin = $state(true);
	let showPassword = $state(false);
	let isLoading = $state(false);
	let isGoogleLoading = $state(false);
	let errors = $state<Record<string, string>>({});
	let serverError = $state('');
	
	let email = $state('');
	let password = $state('');
	let name = $state('');

	function validateField(field: string, value: string) {
		switch (field) {
			case 'email':
				if (!value) return 'Email is required';
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
				return '';
			case 'password':
				if (!value) return 'Password is required';
				if (value.length < 8) return 'Password must be at least 8 characters';
				return '';
			case 'name':
				if (!isLogin && !value.trim()) return 'Name is required';
				return '';
			default:
				return '';
		}
	}

	function getErrorMessage(error: any, isLogin: boolean): string {
		if (!error?.message) {
			return 'An unexpected error occurred. Please try again later.';
		}

		const errorMessages = {
			signIn: {
				'invalid': 'Invalid email or password. Please check your credentials and try again.',
				'user not found': 'No account found with this email address. Please sign up first.',
				'many attempts': 'Too many login attempts. Please try again later.'
			},
			signUp: {
				'already exists': 'An account with this email already exists. Please sign in instead.',
				'duplicate': 'An account with this email already exists. Please sign in instead.',
				'weak password': 'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.',
				'password requirements': 'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.'
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
		const emailError = validateField('email', email);
		const passwordError = validateField('password', password);
		const nameError = !isLogin ? validateField('name', name) : '';

		if (emailError || passwordError || nameError) {
			errors = {
				...(emailError && { email: emailError }),
				...(passwordError && { password: passwordError }),
				...(nameError && { name: nameError })
			};
			return;
		}

		isLoading = true;
		serverError = '';

		const authResult = isLogin 
			? await authClient.signIn.email({ email, password })
			: await authClient.signUp.email({ email, password, name });

		if (authResult.error) {
			serverError = getErrorMessage(authResult.error, isLogin);
		}

		isLoading = false;
	}

	async function handleGoogleSignIn() {
		isGoogleLoading = true;
		serverError = '';

		const authResult = await authClient.signIn.social({
			provider: "google"
		});

		if (authResult.error) {
			serverError = getErrorMessage(authResult.error, isLogin);
		}

		isGoogleLoading = false;
	}
</script>

<div class="h-full flex items-center justify-center">
	<div class="max-w-md w-full space-y-8" in:fade={{ duration: 300, easing: quintOut }}>
		<div class="text-center">
			<h2 class="text-3xl font-bold text-foreground font-integral transition-all duration-300">
				{isLogin ? 'Sign in to your account' : 'Create your account'}
			</h2>
			<p class="mt-2 text-sm text-muted-foreground transition-all duration-300">
				{isLogin ? "Don't have an account?" : 'Already have an account?'}
				<button
					type="button"
					class="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
					onclick={() => {
						isLogin = !isLogin;
						errors = {};
						serverError = '';
					}}
				>
					{isLogin ? 'Sign up' : 'Sign in'}
				</button>
			</p>
		</div>

		{#if serverError}
			<div class="bg-destructive/10 border border-destructive/20 rounded-lg p-4" transition:slide={{ duration: 300, easing: quintOut }}>
				<div class="flex items-center space-x-2">
					<AlertCircleIcon class="h-5 w-5 text-destructive flex-shrink-0" />
					<p class="text-sm text-destructive font-medium">{serverError}</p>
				</div>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Google Sign -->
			<button
				type="button"
				onclick={handleGoogleSignIn}
				disabled={isGoogleLoading}
				class="w-full flex justify-center items-center py-2.5 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background transform hover:scale-[1.02] active:scale-[0.98]"
			>
				{#if isGoogleLoading}
					<div class="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></div>
				{:else}
					<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					<span class="transition-all duration-200">Continue with Google</span>
				{/if}
			</button>

			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-input"></div>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or continue with email</span>
				</div>
			</div>

			<div class="space-y-4">
				{#if !isLogin}
					<div transition:slide={{ duration: 400, easing: quintOut }}>
						<label for="name" class="block text-sm font-medium text-foreground">
							Name
						</label>
						<input
							id="name"
							bind:value={name}
							type="text"
							required
							class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-colors duration-200 {errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-input'}"
							placeholder="Enter your full name"
						/>
						{#if errors.name}
							<div class="mt-1 flex items-center space-x-1" transition:fade={{ duration: 200 }}>
								<AlertCircleIcon class="h-4 w-4 text-destructive" />
								<p class="text-sm text-destructive">{errors.name}</p>
							</div>
						{/if}
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium text-foreground">
						E-mail
					</label>
					<input
						id="email"
						bind:value={email}
						type="email"
						required
						class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-colors duration-200 {errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-input'}"
						placeholder="Enter your email address"
					/>
					{#if errors.email}
						<div class="mt-1 flex items-center space-x-1" transition:fade={{ duration: 200 }}>
							<AlertCircleIcon class="h-4 w-4 text-destructive" />
							<p class="text-sm text-destructive">{errors.email}</p>
						</div>
					{/if}
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-foreground">
						Password
					</label>
					<div class="relative">
						<input
							id="password"
							bind:value={password}
							type={showPassword ? 'text' : 'password'}
							required
							class="mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-colors duration-200 {errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-input'}"
							placeholder="Enter your password"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground transition-colors duration-200"
							onclick={() => (showPassword = !showPassword)}
							tabindex="-1"
						>
							{#if showPassword}
								<EyeOffIcon class="h-5 w-5 text-muted-foreground" />
							{:else}
								<EyeIcon class="h-5 w-5 text-muted-foreground" />
							{/if}
						</button>
					</div>
					{#if errors.password}
						<div class="mt-1 flex items-center space-x-1" transition:fade={{ duration: 200 }}>
							<AlertCircleIcon class="h-4 w-4 text-destructive" />
							<p class="text-sm text-destructive">{errors.password}</p>
						</div>
					{/if}
					{#if !isLogin && !errors.password}
						<p class="mt-1 text-xs text-muted-foreground transition-all duration-300" transition:fade={{ duration: 300 }}>
							Password must be at least 8 characters long
						</p>
					{/if}
				</div>
			</div>

			<button
				type="button"
				onclick={handleSubmit}
				disabled={isLoading}
				class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary transform hover:scale-[1.02] active:scale-[0.98]"
			>
				{#if isLoading}
					<div class="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
				{:else}
					<span class="transition-all duration-200">{isLogin ? 'Sign in' : 'Create account'}</span>
				{/if}
			</button>
		</div>
	</div>
</div> 