<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { AlertCircleIcon } from '$lib/components/icons';
	import { goto } from '$app/navigation';
	import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '$lib/schemas';
	import { AuthForm, ProvidersSignIn } from './_forms';

	let isLogin = $state(true);
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

<div class="grid min-h-[70vh] place-items-center">
	<div class="w-full max-w-md space-y-8" in:fade={{ duration: 300, easing: quintOut }}>
		<div class="text-center">
			<h2 class="text-foreground font-integral text-3xl font-bold transition-all duration-300">
				{isLogin ? 'Sign in to your account' : 'Create your account'}
			</h2>
			<p class="text-muted-foreground mt-2 text-sm transition-all duration-300">
				{isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
					type="button"
                    class="text-primary hover:text-primary/80 font-medium transition-colors duration-200 cursor-pointer"
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
			<ProvidersSignIn {isGoogleLoading} onGoogleSignIn={handleGoogleSignIn} {serverError} />

			<AuthForm
				{isLogin}
				bind:email
				bind:password
				bind:name
				{errors}
				{isLoading}
				onSubmit={handleSubmit}
			/>
		</div>
	</div>
</div>
