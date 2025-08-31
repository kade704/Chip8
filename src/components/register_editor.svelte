<script lang="ts">
    import { registers } from "../stores/registers";
    import { isRunning } from "../stores/state";
    import EditableByte from "./editable_byte.svelte";
    import Panel from "./panel.svelte";

    const handleUpdatePC = (value: number, byte: number) => {
        registers.update((state) => {
            let pc = state.PC;
            if (byte === 1) {
                pc = (pc & 0x00ff) | (value << 8);
            } else {
                pc = (pc & 0xff00) | value;
            }
            state.PC = pc;
            return state;
        });
    };

    const handleUpdateI = (value: number, byte: number) => {
        registers.update((state) => {
            let i = state.I;
            if (byte === 1) {
                i = (i & 0x00ff) | (value << 8);
            } else {
                i = (i & 0xff00) | value;
            }
            state.I = i;
            return state;
        });
    };

    const handleUpdateV = (value: number, index: number) => {
        registers.update((state) => {
            state.V[index] = value;
            return state;
        });
    };

    const handleUpdateSP = (value: number) => {
        registers.update((state) => {
            state.SP = value;
            return state;
        });
    };

    const handleUpdateDT = (value: number) => {
        registers.update((state) => {
            state.DT = value;
            return state;
        });
    };

    const handleUpdateST = (value: number) => {
        registers.update((state) => {
            state.ST = value;
            return state;
        });
    };
</script>

<Panel title="Registers" width={200} height={230}>
    {#if $isRunning}
        <p class="text-neutral-400 text-sm">Registers are disabled while the emulator is running</p>
    {:else}
        <div class="flex flex-row gap-5">
            <div class="flex flex-col">
                <div class="flex items-center">
                    <p class="w-3 text-right text-neutral-400 text-sm mr-2">PC</p>
                    <EditableByte value={($registers.PC & 0xff00) >> 8} handleUpdate={(value) => handleUpdatePC(value, 1)} />
                    <EditableByte value={$registers.PC & 0x00ff} handleUpdate={(value) => handleUpdatePC(value, 2)} />
                </div>
                <div class="flex items-center">
                    <p class="w-3 text-right text-neutral-400 text-sm mr-2">I</p>
                    <EditableByte value={($registers.I & 0xff00) >> 8} handleUpdate={(value) => handleUpdateI(value, 1)} />
                    <EditableByte value={$registers.I & 0x00ff} handleUpdate={(value) => handleUpdateI(value, 2)} />
                </div>
                <div class="flex items-center">
                    <p class="w-3 text-right text-neutral-400 text-sm mr-2">SP</p>
                    <EditableByte value={$registers.SP} handleUpdate={handleUpdateSP} />
                </div>
                <div class="flex items-center">
                    <p class="w-3 text-right text-neutral-400 text-sm mr-2">DT</p>
                    <EditableByte value={$registers.DT} handleUpdate={handleUpdateDT} />
                </div>
                <div class="flex items-center">
                    <p class="w-3 text-right text-neutral-400 text-sm mr-2">ST</p>
                    <EditableByte value={$registers.ST} handleUpdate={handleUpdateST} />
                </div>
            </div>
            <div class="flex flex-col">
                {#each $registers.V.slice(0, 8) as value, i}
                    <div class="flex items-center">
                        <p class="w-3 text-right text-neutral-400 text-sm mr-2">V{i.toString(16).toUpperCase()}</p>
                        <EditableByte {value} handleUpdate={(value) => handleUpdateV(value, i)} />
                    </div>
                {/each}
            </div>
            <div class="flex flex-col">
                {#each $registers.V.slice(8, 16) as value, i}
                    <div class="flex items-center">
                        <p class="w-3 text-right text-neutral-400 text-sm mr-2">V{(i + 8).toString(16).toUpperCase()}</p>
                        <EditableByte {value} handleUpdate={(value) => handleUpdateV(value, i + 8)} />
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</Panel>
