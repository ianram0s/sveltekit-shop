<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import RangeSlider from 'svelte-range-slider-pips';

	interface Props {
		min: number;
		max: number;
		value: [number, number];
		class?: string;
		step?: number;
	}

	let { min, max, value = [0, 100], class: className = '', step = 1 }: Props = $props();

	const dispatch = createEventDispatcher<{
		change: [number, number];
	}>();

	let values = $state(value);

	$effect(() => {
		values = value;
	});

	function handleChange(event: CustomEvent) {
		const newValues = event.detail.values as [number, number];
		values = newValues;
		dispatch('change', newValues);
	}
</script>

<div class="relative py-2.5 {className}">
	<RangeSlider
		{min}
		{max}
		{step}
		values={values}
		on:change={handleChange}
		range
		pushy
		pipstep={20}
		rest="pip"
		--slider-track-background="hsl(var(--muted))"
		--slider-connect-background="hsl(var(--foreground))"
		--slider-handle-background="hsl(var(--background))"
		--slider-handle-border="hsl(var(--border))"
		--slider-pip-color="hsl(var(--muted-foreground))"
		--slider-pip-text-color="hsl(var(--muted-foreground))"
		--slider-height="8px"
		--slider-handle-width="20px"
		--slider-handle-height="20px"
		--slider-handle-box-shadow="0 2px 6px hsl(var(--foreground) / 0.1)"
		--slider-handle-focus-box-shadow="0 4px 12px hsl(var(--foreground) / 0.2)"
		--slider-handle-hover-box-shadow="0 3px 8px hsl(var(--foreground) / 0.15)"
		--slider-handle-border-width="2px"
		--slider-handle-border-focus="hsl(var(--ring))"
		--slider-pip-text-size="12px"
		--slider-pip-height="4px"
		--slider-connect-border-radius="4px"
		--slider-track-border-radius="4px"
		--slider-handle-border-radius="50%"
	/>
	
	<!-- Value display -->
	<div class="flex justify-between text-sm mt-3">
		<span>${values[0]}</span>
		<span>${values[1]}</span>
	</div>
</div> 