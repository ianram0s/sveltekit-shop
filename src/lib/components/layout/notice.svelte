<script lang="ts">
    import { XIcon } from '$lib/components/icons';
    import { slide } from 'svelte/transition';
    import { IsMobile } from '$lib/hooks/is-mobile.svelte';

    let { noticeVisible, onClose }: { noticeVisible: boolean; onClose: () => void } = $props();

    const isMobile = new IsMobile();
</script>

{#if noticeVisible}
    <div
        class="fixed top-0 right-0 left-0 z-50 w-full bg-black px-0 py-2 text-white dark:bg-white dark:text-black"
        in:slide={{ duration: 350 }}
        out:slide={{ duration: 200 }}
    >
        <div class="relative mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
            <span class="mx-auto text-sm font-medium">
                {#if isMobile.current}
                    This is WiP! Check out the source code on
                    <a href="https://github.com/ianram0s/sveltekit-shop" class="text-blue-500">GitHub</a> ✨
                {:else}
                    Welcome! This project is a work in-progress, check out the source code on
                    <a href="https://github.com/ianram0s/sveltekit-shop" class="text-blue-500">GitHub</a> ✨
                {/if}
            </span>
            <button
                class="hover:text-destructive absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-white dark:text-black"
                aria-label="Close notice"
                onclick={onClose}
            >
                <XIcon class="h-5 w-5" />
            </button>
        </div>
    </div>
{/if}
