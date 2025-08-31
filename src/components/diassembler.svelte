<script lang="ts">
    import { decodeOpcode } from "../libs/interpreter";
    import { memory } from "../stores/memory";
    import Panel from "./panel.svelte";
    import { registers } from "../stores/registers";
    import { isError, isRunning } from "../stores/state";
    import EditableCode from "./editable_code.svelte";
    import clsx from "clsx";

    let container: HTMLDivElement;
    let cursor: HTMLDivElement;

    type Opcode = {
        address: number;
        b1: string;
        b2: string;
        code: string;
    };
    let data: Opcode[] = [];

    memory.subscribe((mem) => {
        data = [];
        for (let i = 0x200; i < mem.length; i += 2) {
            let b1 = mem[i].toString(16).toUpperCase().padStart(2, "0");
            let b2 = mem[i + 1].toString(16).toUpperCase().padStart(2, "0");
            let opcode = (mem[i] << 8) | mem[i + 1];
            let code = decodeOpcode(opcode);
            data.push({ address: i, b1, b2, code });
        }
    });

    function updatePosition(idx: number) {
        if (container) {
            const containerTop = idx * 10 - 160;
            if (containerTop < 0) {
                container.scrollTop = 0;
            } else if (containerTop > container.scrollHeight - container.clientHeight) {
                container.scrollTop = container.scrollHeight - container.clientHeight;
            } else {
                container.scrollTop = containerTop;
            }
        }

        if (cursor) {
            cursor.style.top = `${idx * 10}px`;
        }
    }

    registers.subscribe(($registers) => {
        if (!$isRunning) {
            updatePosition($registers.PC - 0x200);
        }
    });

    isRunning.subscribe(($isRunning) => {
        setTimeout(() => {
            if (!$isRunning) {
                updatePosition($registers.PC - 0x200);
            }
        });
    });
</script>

<Panel title="Disassembler" width={320} height={512}>
    <div class="min-w-[300px]">
        {#if $isRunning}
            <p class="text-neutral-400 text-sm">Disassembler is disabled while the emulator is running</p>
        {:else}
            <div class="relative h-[512px] overflow-y-auto" bind:this={container}>
                {#each data as { address, b1, b2, code }}
                    <div class="px-2 flex flex-row gap-2 items-center">
                        <p class="w-10 text-neutral-300 text-sm">0x{address.toString(16).toUpperCase().padStart(4, "0")}</p>
                        <p class="ml-4 w-4 text-neutral-400 text-sm">{b1}</p>
                        <p class="mr-4 w-4 text-neutral-400 text-sm">{b2}</p>
                        <EditableCode
                            value={code}
                            handleUpdate={(opcode) => {
                                memory.update((mem) => {
                                    mem[address] = (opcode >> 8) & 0xff;
                                    mem[address + 1] = opcode & 0xff;
                                    return mem;
                                });
                            }}
                        />
                    </div>
                {/each}
                <div class={clsx("absolute w-full h-[20px] top-0 opacity-20 pointer-events-none", $isError ? "bg-red-500" : "bg-neutral-300")} bind:this={cursor}></div>
            </div>
        {/if}
    </div>
</Panel>
