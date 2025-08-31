<script lang="ts">
    import Icon from "@iconify/svelte";
    import { memory } from "../stores/memory";
    import { openedFilePath } from "../stores/state";

    let inputRef: HTMLInputElement;
    let files: FileList | null = $state(null);

    $effect(() => {
        if (files === null) return;

        if (files.length === 0) return;

        let filename = files[0].name;
        openedFilePath.set(filename);

        let reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target === null) return;

            let data = new Uint8Array(e.target.result as ArrayBuffer);
            memory.update((state) => {
                state.fill(0, 0x200);
                for (let i = 0; i < data.length; i++) {
                    state[i + 0x200] = data[i];
                }
                return state;
            });
        };
        reader.readAsArrayBuffer(files[0]);
    });

    const handleLoadClicked = async () => {
        inputRef.click();
    };

    const handleSaveClicked = async () => {
        // let filename = path.split("\\").pop() as string;
        // file.set(filename);

        let data = $memory.slice(0x200);
        let lastNonZeroIndex = data.length - 1;
        while (data[lastNonZeroIndex] === 0) {
            lastNonZeroIndex--;
        }
        data = data.slice(0, lastNonZeroIndex + 1);

        let tempElement = document.createElement("a");
        document.body.appendChild(tempElement);
        let blob = new Blob([new Uint8Array(data)], { type: "application/octet-stream" });
        let url = URL.createObjectURL(blob);
        tempElement.href = url;
        tempElement.download = $openedFilePath;
        tempElement.click();
        tempElement.remove();
    };
</script>

<div class="h-8 flex flex-row">
    <input type="file" id="file" class="hidden" bind:files bind:this={inputRef} />
    <div class="flex flex-row gap-0.5">
        <button title="Load" onclick={handleLoadClicked} class="w-12 h-full flex items-center justify-center rounded-l-md bg-neutral-700 hover:bg-neutral-600 transition-all disabled:bg-neutral-900">
            <Icon icon="mdi:file-upload" class="w-6 h-6 text-neutral-100" />
        </button>

        <button title="Save" onclick={handleSaveClicked} class="w-12 h-full flex items-center justify-center rounded-r-md bg-neutral-700 hover:bg-neutral-600 transition-all disabled:bg-neutral-900">
            <Icon icon="mdi:content-save" class="w-6 h-6 text-neutral-100" />
        </button>
    </div>
</div>
