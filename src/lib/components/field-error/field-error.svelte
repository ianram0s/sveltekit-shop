<script lang="ts">
    import { AlertCircleIcon } from '$lib/components/icons';
    import { fade } from 'svelte/transition';

    let {
        error,
        class: className = '',
    }: {
        error?: string;
        class?: string;
    } = $props();
</script>

{#if error}
    <div class="mt-1 flex items-center space-x-1 {className}" transition:fade={{ duration: 200 }}>
        <AlertCircleIcon class="text-destructive h-4 w-4" />
        <p class="text-destructive text-sm">{error}</p>
    </div>
{/if}
