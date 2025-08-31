<script lang="ts">
    import Stepper from "./stepper.svelte";
    import { openedFilePath } from "../stores/state";
    import MenuButtons from "./menu_buttons.svelte";
</script>

<div class="p-1 w-full bg-neutral-800 flex flex-row items-center shadow-lg">
    <p class="mx-10 text-neutral-100 font-semibold">Chip8 Emulator</p>
    <MenuButtons />
    <p class="flex-1 text-center font-semibold text-neutral-100">{$openedFilePath}</p>
    <Stepper />
</div>
