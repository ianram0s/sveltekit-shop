<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Loader2 } from '@lucide/svelte';

    interface Props {
        visible: boolean;
        message?: string;
    }

    let { visible, message = 'Loading...' }: Props = $props();
</script>

{#if visible}
    <div
        class="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
    >
        <div class="flex flex-col items-center gap-3">
            <Loader2 class="text-muted-foreground h-10 w-10 animate-spin" />
            <span class="text-muted-foreground animate-pulse text-sm">{message}</span>
        </div>
    </div>
{/if}
