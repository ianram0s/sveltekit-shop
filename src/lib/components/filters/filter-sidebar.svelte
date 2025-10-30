<script lang="ts">
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { SlidersHorizontal } from '@lucide/svelte';
    import type { Color } from '$lib/types/product';
    import DualSlider from '@/components/dual-slider-input/dual-slider.svelte';
    import FilterAccordion from './accordion-filter.svelte';
    import ColorFilter from './color-filter.svelte';
    import SizeFilter from './size-filter.svelte';

    interface Props {
        colors: Color[];
        sizes: string[];
        minPossible: number;
        maxPossible: number;
        priceRange: [number, number];
        selectedColors: Set<string>;
        selectedSizes: Set<string>;
        onPriceChange: (range: [number, number]) => void;
        onColorToggle: (color: string) => void;
        onSizeToggle: (size: string) => void;
    }

    let {
        colors,
        sizes,
        minPossible,
        maxPossible,
        priceRange,
        selectedColors,
        selectedSizes,
        onPriceChange,
        onColorToggle,
        onSizeToggle,
    }: Props = $props();

    let openSections = $state({ price: true, colors: true, sizes: true });

    function handlePriceChange(event: CustomEvent<[number, number]>) {
        onPriceChange(event.detail);
    }
</script>

<aside
    class="border-border hidden w-64 shrink-0 self-start rounded-xl border p-4 lg:block"
    in:fly={{ x: -50, duration: 400, easing: quintOut }}
>
    <div class="mb-4 flex items-center justify-between">
        <h3 class="text-foreground text-lg font-semibold">Filters</h3>
        <SlidersHorizontal class="text-muted-foreground h-5 w-5" />
    </div>
    <div class="border-border my-4 border-b"></div>

    <!-- Price Filter -->
    <FilterAccordion
        title="Price"
        isOpen={openSections.price}
        onToggle={() => (openSections.price = !openSections.price)}
    >
        {#snippet children()}
            <DualSlider
                min={minPossible}
                max={maxPossible}
                value={priceRange}
                on:change={handlePriceChange}
                class="w-full"
            />
        {/snippet}
    </FilterAccordion>

    <div class="border-border my-4 border-b"></div>

    <!-- Colors Filter -->
    <FilterAccordion
        title="Colors"
        isOpen={openSections.colors}
        onToggle={() => (openSections.colors = !openSections.colors)}
    >
        {#snippet children()}
            <ColorFilter {colors} {selectedColors} onToggleColor={onColorToggle} compact={true} />
        {/snippet}
    </FilterAccordion>

    <div class="border-border my-4 border-b"></div>

    <!-- Sizes Filter -->
    <FilterAccordion
        title="Size"
        isOpen={openSections.sizes}
        onToggle={() => (openSections.sizes = !openSections.sizes)}
    >
        {#snippet children()}
            <SizeFilter {sizes} {selectedSizes} onToggleSize={onSizeToggle} compact={true} />
        {/snippet}
    </FilterAccordion>
</aside>
