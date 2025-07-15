<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { SettingsIcon, ClockIcon } from '$lib/components/icons';
</script>

<div class="space-y-6" in:fade={{ duration: 300, easing: quintOut }}>
	<h2 class="text-foreground text-2xl font-semibold">Account Settings</h2>

	<div class="bg-card border-border rounded-lg border p-12 text-center">
		<SettingsIcon class="text-muted-foreground mx-auto mb-4 h-16 w-16" />
		<h3 class="text-foreground mb-2 text-xl font-semibold">Under Construction</h3>
		<p class="text-muted-foreground mb-6">
			Account settings are coming soon! You'll be able to manage your password,
			notifications, and other preferences here.
		</p>
		<div class="text-muted-foreground flex items-center justify-center space-x-2 text-sm">
			<ClockIcon class="h-4 w-4" />
			<span>Coming soon</span>
		</div>
	</div>
</div> 