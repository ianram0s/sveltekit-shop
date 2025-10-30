<script lang="ts">
    import { scale } from 'svelte/transition';
    import { Check } from '@lucide/svelte';
    import type { Color } from '$lib/types/product';

    interface Props {
        colors: Color[];
        selectedColors: Set<string>;
        onToggleColor: (colorName: string) => void;
        compact?: boolean;
    }

    let { colors, selectedColors, onToggleColor, compact = false }: Props = $props();
</script>

<div class="flex flex-wrap gap-{compact ? '1' : '2'}">
    {#each colors as color, i}
        <button
            type="button"
            class="w-{compact ? '10' : '12'} h-{compact
                ? '10'
                : '12'} flex items-center justify-center focus:outline-none focus:ring-{compact
                ? '1'
                : '2'} focus:ring-ring focus:ring-offset-{compact
                ? '1'
                : '2'} relative rounded-full transition-all duration-200 hover:scale-110"
            onclick={() => onToggleColor(color.name)}
            aria-label={color.name}
            in:scale={{ duration: 200, delay: i * 50, start: 0.8 }}
        >
            <div
                class="w-{compact ? '8' : '10'} h-{compact
                    ? '8'
                    : '10'} border-border rounded-full border-2 transition-all duration-200"
                style="background: {color.hex};"
            ></div>
            {#if selectedColors.has(color.name)}
                <div class="absolute" in:scale={{ duration: 200 }}>
                    <Check
                        class="w-{compact ? '4' : '5'} h-{compact ? '4' : '5'} transition-all duration-200"
                        style="color: {color.name.toLowerCase() === 'white' ? 'black' : 'white'}"
                    />
                </div>
            {/if}
        </button>
    {/each}
</div>
