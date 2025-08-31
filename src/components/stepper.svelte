<script lang="ts">
    import Icon from "@iconify/svelte";
    import { autoStep, manualStep, pause, restart } from "../libs/runner";
    import { frequency, isRunning } from "../stores/state";
    import FrequencySlider from "./frequency_slider.svelte";
</script>

<div class="flex flex-row">
    <div class="flex flex-row gap-0.5">
        <button title="Restart" onclick={restart} disabled={$isRunning} class="w-10 flex items-center justify-center rounded-l-md bg-neutral-700 hover:bg-neutral-600 transition-all disabled:bg-neutral-900">
            <Icon icon="mdi:restart" class="w-6 h-6 text-neutral-100" />
        </button>

        <button title="Manual Step" onclick={manualStep} disabled={$isRunning} class="w-10 flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 transition-all disabled:bg-neutral-900">
            <Icon icon="mdi:step-forward" class="w-6 h-6 text-neutral-100" />
        </button>

        {#if $isRunning}
            <button title="Auto Step" onclick={pause} class="w-10 flex items-center justify-center rounded-r-md bg-neutral-700 hover:bg-neutral-600 transition-all">
                <Icon icon="mdi:pause" class="w-6 h-6 text-neutral-100" />
            </button>
        {:else}
            <button title="Auto Step" onclick={autoStep} class="w-10 flex items-center justify-center rounded-r-md bg-neutral-700 hover:bg-neutral-600 transition-all">
                <Icon icon="mdi:play" class="w-6 h-6 text-neutral-100" />
            </button>
        {/if}
    </div>

    <div class="w-2"></div>

    <FrequencySlider initialValue={200} min={1} max={1000} onChange={(value) => frequency.set(value)} />
</div>
