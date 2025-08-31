<script lang="ts">
    import { get } from "svelte/store";
    import { isRunning } from "../stores/state";

    type Props = {
        initialValue: number;
        min: number;
        max: number;
        onChange: (value: number) => void;
    };

    let { initialValue, min, max, onChange }: Props = $props();

    let value = $state(initialValue);

    let slider: HTMLDivElement;
    let sliderFill: HTMLDivElement;

    let mouseDrag = false;

    $effect(() => {
        const percent = (value - min) / (max - min);
        value = Math.floor(percent * (max - min) + min);

        sliderFill.style.width = `${percent * 100}%`;
    });

    const handleSliderDragStart = () => {
        mouseDrag = true;
    };

    const handleSliderDragEnd = () => {
        mouseDrag = false;
    };

    const handleSliderDragged = (e: MouseEvent) => {
        if (!mouseDrag) return;

        if (get(isRunning)) {
            return;
        }

        const sliderRect = slider.getBoundingClientRect();
        const x = e.clientX - sliderRect.left;
        const percent = x / sliderRect.width;

        value = Math.floor(percent * (max - min) + min);

        sliderFill.style.width = `${percent * 100}%`;

        onChange(value);
    };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative w-[120px] flex flex-col rounded-md bg-neutral-900 hover:bg-neutral-700 cursor-pointer transition-all" bind:this={slider} onmousemove={handleSliderDragged} onmousedown={handleSliderDragStart} onmouseup={handleSliderDragEnd}>
    <div class="absolute h-full bg-neutral-500 rounded-md" bind:this={sliderFill}></div>
    <p class="z-10 text-neutral-300 w-full h-full text-center text-sm leading-8 select-none">{value} step/s</p>
</div>
