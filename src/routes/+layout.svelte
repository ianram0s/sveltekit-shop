<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import type { LayoutServerData } from './$types';

	let { children, data }: { children: any; data: LayoutServerData } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- App Name -->
				<div class="flex items-center">
					<a href="/" class="text-xl font-bold text-gray-900 hover:text-gray-700 font-integral">
						MyApp
					</a>
				</div>

				<!-- User Section -->
				<div class="flex items-center space-x-4">
					{#if data.user}
						<!-- User Avatar and Logout -->
						<div class="flex items-center space-x-3">
							<div class="flex items-center space-x-2">
								<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
									<span class="text-white text-sm font-medium">
										{data.user.username.charAt(0).toUpperCase()}
									</span>
								</div>
								<span class="text-sm text-gray-700">
									{data.user.username}
								</span>
							</div>
							<form method="post" action="/logout" use:enhance>
								<button
									type="submit"
									class="text-sm text-gray-500 hover:text-gray-700"
								>
									Sign out
								</button>
							</form>
						</div>
					{:else}
						<!-- Sign In Button -->
						<a
							href="/signin"
							class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
						>
							Sign In
						</a>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
</div>
