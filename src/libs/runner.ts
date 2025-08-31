import { get } from "svelte/store";
import { memory } from "../stores/memory";
import { registers, resetRegisters } from "../stores/registers";
import { clearScreen, screen } from "../stores/screen";
import { keys } from "../stores/keys";
import { frequency, isError, isRunning } from "../stores/state";
import { INSTRUCTIONS } from "../constants/instructions";

export function restart() {
    if (get(isError)) {
        isError.set(false);
    }

    resetRegisters();
    clearScreen();
}

export function pause() {
    isRunning.set(false);
}

export function manualStep() {
    if (!runCycle()) {
        isError.set(true);
    }
}

export function autoStep() {
    isRunning.set(true);
    const delay = 1000 / get(frequency);
    const step = () => {
        if (!runCycle()) {
            isError.set(true);
            isRunning.set(false);
            return;
        }
        if (get(isRunning)) {
            setTimeout(step, delay);
        }
    };
    step();
}

function runCycle(): boolean {
    const regs = get(registers);
    const mem = get(memory);
    const scr = get(screen);
    const keyState = get(keys);

    if (regs.DT > 0) {
        regs.DT--;
    }

    const opcode = (mem[regs.PC] << 8) | mem[regs.PC + 1];

    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0x00f0) >> 4;
    const n = opcode & 0x000f;
    const kk = opcode & 0x00ff;
    const nnn = opcode & 0x0fff;

    let instruction = null;
    for (const inst of INSTRUCTIONS) {
        if ((opcode & inst.mask) === inst.value) {
            instruction = inst;
            break;
        }
    }

    if (!instruction) {
        return false;
    }

    regs.PC += 2;

    switch (instruction.name) {
        case "CLS":
            screen.set(Array(64 * 32).fill(false));
            break;
        case "RET":
            regs.SP--;
            regs.PC = regs.stack[regs.SP];
            break;
        case "JP addr":
            regs.PC = nnn;
            break;
        case "CALL addr":
            regs.stack[regs.SP] = regs.PC;
            regs.SP++;
            regs.PC = nnn;
            break;
        case "SE Vx, byte":
            if (regs.V[x] === kk) {
                regs.PC += 2;
            }
            break;
        case "SNE Vx, byte":
            if (regs.V[x] !== kk) {
                regs.PC += 2;
            }
            break;
        case "SE Vx, Vy":
            if (regs.V[x] === regs.V[y]) {
                regs.PC += 2;
            }
            break;
        case "LD Vx, byte":
            regs.V[x] = kk;
            break;
        case "ADD Vx, byte":
            regs.V[x] = (regs.V[x] + kk) & 0xff;
            break;
        case "LD Vx, Vy":
            regs.V[x] = regs.V[y];
            break;
        case "OR Vx, Vy":
            regs.V[x] |= regs.V[y];
            break;
        case "AND Vx, Vy":
            regs.V[x] &= regs.V[y];
            break;
        case "XOR Vx, Vy":
            regs.V[x] ^= regs.V[y];
            break;
        case "ADD Vx, Vy":
            {
                const sum = regs.V[x] + regs.V[y];
                regs.V[x] = sum & 0xff;
                regs.V[0xf] = sum > 0xff ? 1 : 0;
            }
            break;
        case "SUB Vx, Vy":
            regs.V[0xf] = regs.V[x] > regs.V[y] ? 1 : 0;
            regs.V[x] = (regs.V[x] - regs.V[y]) & 0xff;
            break;
        case "SHR Vx":
            regs.V[0xf] = regs.V[x] & 0x1;
            regs.V[x] >>= 1;
            break;
        case "SUBN Vx, Vy":
            regs.V[0xf] = regs.V[y] > regs.V[x] ? 1 : 0;
            regs.V[x] = (regs.V[y] - regs.V[x]) & 0xff;
            break;
        case "SHL Vx":
            regs.V[0xf] = regs.V[x] >> 7;
            regs.V[x] = (regs.V[x] << 1) & 0xff;
            break;
        case "SNE Vx, Vy":
            if (regs.V[x] !== regs.V[y]) {
                regs.PC += 2;
            }
            break;
        case "LD I, addr":
            regs.I = nnn;
            break;
        case "JP V0, addr":
            regs.PC = nnn + regs.V[0];
            break;
        case "RND Vx, byte":
            regs.V[x] = Math.floor(Math.random() * 256) & kk;
            break;
        case "DRW Vx, Vy, N":
            {
                const xCoord = regs.V[x];
                const yCoord = regs.V[y];
                let flipped = false;
                const newScreen = [...scr];
                for (let i = 0; i < n; i++) {
                    const sprite = mem[regs.I + i];
                    for (let j = 0; j < 8; j++) {
                        if ((sprite & (0x80 >> j)) !== 0) {
                            const screenX = (xCoord + j) % 64;
                            const screenY = (yCoord + i) % 32;
                            const index = screenY * 64 + screenX;
                            if (newScreen[index]) {
                                flipped = true;
                            }
                            newScreen[index] = !newScreen[index];
                        }
                    }
                }
                regs.V[0xf] = flipped ? 1 : 0;
                screen.set(newScreen);
            }
            break;
        case "SKP Vx":
            if (keyState[regs.V[x]]) {
                regs.PC += 2;
            }
            break;
        case "SKNP Vx":
            if (!keyState[regs.V[x]]) {
                regs.PC += 2;
            }
            break;
        case "LD Vx, DT":
            regs.V[x] = regs.DT;
            break;
        case "LD Vx, K":
            {
                let keyPressed = false;
                for (let i = 0; i < 16; i++) {
                    if (keyState[i]) {
                        regs.V[x] = i;
                        keyPressed = true;
                        break;
                    }
                }
                if (!keyPressed) {
                    regs.PC -= 2;
                }
            }
            break;
        case "LD DT, Vx":
            regs.DT = regs.V[x];
            break;
        case "LD ST, Vx":
            regs.ST = regs.V[x];
            break;
        case "ADD I, Vx":
            regs.I = (regs.I + regs.V[x]) & 0xfff;
            break;
        case "LD F, Vx":
            regs.I = (regs.V[x] * 5) & 0xfff;
            break;
        case "LD B, Vx":
            mem[regs.I] = Math.floor(regs.V[x] / 100);
            mem[regs.I + 1] = Math.floor((regs.V[x] / 10) % 10);
            mem[regs.I + 2] = regs.V[x] % 10;
            memory.set(mem);
            break;
        case "LD [I], Vx":
            for (let i = 0; i <= x; i++) {
                mem[regs.I + i] = regs.V[i];
            }
            memory.set(mem);
            break;
        case "LD Vx, [I]":
            for (let i = 0; i <= x; i++) {
                regs.V[i] = mem[regs.I + i];
            }
            break;
    }

    registers.set(regs);

    return true;
}
