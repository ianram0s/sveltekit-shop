<script lang="ts">
	import {
		SiVisa,
		SiMastercard,
		SiPaypal,
		SiApplepay,
		SiGooglepay
	} from '@icons-pack/svelte-simple-icons';

	const paymentBrands = [
		{ icon: SiVisa, color: '#1A1F71' },
		{ icon: SiMastercard, color: undefined },
		{ icon: SiPaypal, color: '#003087' },
		{ icon: SiApplepay, color: undefined },
		{ icon: SiGooglepay, color: '#4285F4' }
	] as const;
</script>

<footer class="bg-background border-t">
	<div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
			<div class="text-muted-foreground text-sm">IanBytes.com © 2025. All Rights Reserved</div>
			<div class="flex items-center space-x-3">
				{#each paymentBrands as { icon: Icon, color }}
					<div class="bg-card rounded-lg py-1 px-3 shadow-lg">
						<svelte:component this={Icon} size={32} color={color} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</footer>
