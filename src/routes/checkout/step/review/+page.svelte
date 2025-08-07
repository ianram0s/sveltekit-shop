<script lang="ts">
	import { ReviewForm } from '../_forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center gap-2">
		<div class="text-primary h-5 w-5">✅</div>
		<h2 class="text-xl font-semibold">Review & Confirmation</h2>
	</div>

	<ReviewForm formData={data.form} />
</div>
