<script lang="ts">
    import type { Snippet } from "svelte";
    import clsx from "clsx";

    type Props = {
        title: string;
        width: number;
        height: number;
        children: Snippet;
    };

    let { title, width = 1, height = 1, children }: Props = $props();

    const wholeWidth = width + 16; /* padding */
    const wholeHeight = height + 16 /* padding */ + 28; /* header */
</script>

<div
    class={clsx("flex flex-col bg-neutral-800 rounded-md shadow-lg border border-neutral-700")}
    style={"width: " + wholeWidth + "px; height: " + wholeHeight + "px;"}
>
    <div class="h-7 bg-neutral-700 p-1 rounded-t-md">
        <h3 class="text-neutral-400 text-sm font-bold ml-2">{title}</h3>
    </div>
    <div class="p-2 flex flex-col">
        {@render children()}
    </div>
</div>
