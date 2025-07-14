<script lang="ts">
	let { data } = $props();

	const user = data.user;
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-foreground font-integral text-4xl font-bold">Admin Dashboard</h1>
			<p class="text-muted-foreground mt-2">Welcome to the admin area</p>
		</div>

		<div class="bg-card border-border rounded-lg border p-8 text-center">
			<h2 class="text-foreground mb-4 text-2xl font-semibold">
				Hello {user.role}!
			</h2>
			<p class="text-muted-foreground mb-6">
				You are logged in as <span class="text-foreground font-semibold">{user.name}</span>
				with <span class="text-foreground font-semibold capitalize">{user.role}</span> privileges.
			</p>
			<div class="bg-accent rounded-lg p-4 text-sm">
				<p class="text-muted-foreground">
					This is a placeholder admin dashboard.
					{#if user.role === 'owner'}
						As an owner, you will have access to all administrative features.
					{:else}
						As an admin, you will have access to most administrative features.
					{/if}
				</p>
			</div>
		</div>
	</div>
</div>
