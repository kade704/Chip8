import { writable } from "svelte/store";

export const frequency = writable(60);
export const isRunning = writable(false);
export const isError = writable(false);
export const openedFilePath = writable("untitled.ch8");
