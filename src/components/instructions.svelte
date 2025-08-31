<script>
    import { INSTRUCTIONS } from "../constants/instructions";
    import Panel from "./panel.svelte";
</script>

<Panel title="Instructions Documentation" width={430} height={230}>
    <div class="w-[430px] h-[230px] overflow-auto">
        {#each INSTRUCTIONS as instruction}
            <div class="flex flex-row">
                <div class="text-neutral-300 text-sm min-w-[100px]">{instruction.name}</div>
                <div class="text-neutral-400 text-sm min-w-[600px]">{instruction.description}</div>
            </div>
        {/each}
    </div>
</Panel>
