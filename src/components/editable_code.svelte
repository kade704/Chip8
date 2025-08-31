<script lang="ts">
    import { encodeOpcode } from "../libs/interpreter";

    type Props = {
        value: string;
        handleUpdate?: (value: number) => void;
    };

    let { value, handleUpdate }: Props = $props();

    let inputRef: HTMLInputElement;
</script>

<input
    type="text"
    class="text-sm text-left bg-transparent border-none text-neutral-100"
    {value}
    bind:this={inputRef}
    onchange={(_) => {
        inputRef.value = inputRef.value.toUpperCase();
        inputRef.blur();

        const opcode = encodeOpcode(inputRef.value);
        if (opcode == null) {
            inputRef.value = "??";
            if (handleUpdate) handleUpdate(0);
        } else {
            if (handleUpdate) handleUpdate(opcode);
        }
    }}
/>
