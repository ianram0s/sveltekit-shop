<script lang="ts">
	import { GoogleIcon } from "@/components/icons";

	let {
		isGoogleLoading,
		onGoogleSignIn,
		serverError
	}: {
		isGoogleLoading: boolean;
		onGoogleSignIn: () => Promise<void>;
		serverError: string;
	} = $props();
</script>

<div class="space-y-6">
	<!-- Google Sign In Button -->
	<button
		type="button"
		onclick={onGoogleSignIn}
		disabled={isGoogleLoading}
        class="border-input text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring disabled:hover:bg-background flex w-full transform items-center justify-center rounded-md border px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#if isGoogleLoading}
			<div
				class="border-foreground/30 border-t-foreground h-5 w-5 animate-spin rounded-full border-2"
			></div>
		{:else}
			<GoogleIcon />
			<span class="transition-all duration-200">Continue with Google</span>
		{/if}
	</button>

	<!-- Divider -->
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<div class="border-input w-full border-t"></div>
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background text-muted-foreground px-2">Or continue with email</span>
		</div>
	</div>
</div>
