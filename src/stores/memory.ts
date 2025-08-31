import { writable } from "svelte/store";
import { FONT_SET } from "../constants/font_set";

let initialMemory: Uint8Array = new Uint8Array(4096);
for (let i = 0; i < FONT_SET.length; i++) {
    initialMemory[i] = FONT_SET[i];
}

export const memory = writable(initialMemory);
