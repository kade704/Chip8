export const INSTRUCTIONS = [
    // 0x0000
    { mask: 0xffff, value: 0x00e0, name: "CLS", description: "Clear the display" },
    { mask: 0xffff, value: 0x00ee, name: "RET", description: "Return from a subroutine" },

    // 0x1000
    { mask: 0xf000, value: 0x1000, name: "JP addr", description: "Jump to address" },

    // 0x2000
    { mask: 0xf000, value: 0x2000, name: "CALL addr", description: "Call subroutine at address" },

    // 0x3000
    { mask: 0xf000, value: 0x3000, name: "SE Vx, byte", description: "Skip next instruction if Vx = byte" },

    // 0x4000
    { mask: 0xf000, value: 0x4000, name: "SNE Vx, byte", description: "Skip next instruction if Vx != byte" },

    // 0x5000
    { mask: 0xf00f, value: 0x5000, name: "SE Vx, Vy", description: "Skip next instruction if Vx = Vy" },

    // 0x6000
    { mask: 0xf000, value: 0x6000, name: "LD Vx, byte", description: "Set Vx = byte" },

    // 0x7000
    { mask: 0xf000, value: 0x7000, name: "ADD Vx, byte", description: "Set Vx = Vx + byte" },

    // 0x8000
    { mask: 0xf00f, value: 0x8000, name: "LD Vx, Vy", description: "Set Vx = Vy" },
    { mask: 0xf00f, value: 0x8001, name: "OR Vx, Vy", description: "Set Vx = Vx OR Vy" },
    { mask: 0xf00f, value: 0x8002, name: "AND Vx, Vy", description: "Set Vx = Vx AND Vy" },
    { mask: 0xf00f, value: 0x8003, name: "XOR Vx, Vy", description: "Set Vx = Vx XOR Vy" },
    { mask: 0xf00f, value: 0x8004, name: "ADD Vx, Vy", description: "Set Vx = Vx + Vy, set VF = carry" },
    { mask: 0xf00f, value: 0x8005, name: "SUB Vx, Vy", description: "Set Vx = Vx - Vy, set VF = NOT borrow" },
    { mask: 0xf00f, value: 0x8006, name: "SHR Vx", description: "Set Vx = Vx SHR 1" },
    { mask: 0xf00f, value: 0x8007, name: "SUBN Vx, Vy", description: "Set Vx = Vy - Vx, set VF = NOT borrow" },
    { mask: 0xf00f, value: 0x800e, name: "SHL Vx", description: "Set Vx = Vx SHL 1" },

    // 0x9000
    { mask: 0xf00f, value: 0x9000, name: "SNE Vx, Vy", description: "Skip next instruction if Vx != Vy" },

    // 0xa000
    { mask: 0xf000, value: 0xa000, name: "LD I, addr", description: "Set I = addr" },

    // 0xb000
    { mask: 0xf000, value: 0xb000, name: "JP V0, addr", description: "Jump to location addr + V0" },

    // 0xc000
    { mask: 0xf000, value: 0xc000, name: "RND Vx, byte", description: "Set Vx = random byte AND byte" },

    // 0xd000
    { mask: 0xf000, value: 0xd000, name: "DRW Vx, Vy, N", description: "Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision" },

    // 0xe000
    { mask: 0xf0ff, value: 0xe09e, name: "SKP Vx", description: "Skip next instruction if key with the value of Vx is pressed" },
    { mask: 0xf0ff, value: 0xe0a1, name: "SKNP Vx", description: "Skip next instruction if key with the value of Vx is not pressed" },

    // 0xf000
    { mask: 0xf0ff, value: 0xf007, name: "LD Vx, DT", description: "Set Vx = delay timer value" },
    { mask: 0xf0ff, value: 0xf00a, name: "LD Vx, K", description: "Wait for a key press, store the value of the key in Vx" },
    { mask: 0xf0ff, value: 0xf015, name: "LD DT, Vx", description: "Set delay timer = Vx" },
    { mask: 0xf0ff, value: 0xf018, name: "LD ST, Vx", description: "Set sound timer = Vx" },
    { mask: 0xf0ff, value: 0xf01e, name: "ADD I, Vx", description: "Set I = I + Vx" },
    { mask: 0xf0ff, value: 0xf029, name: "LD F, Vx", description: "Set I = location of sprite for digit Vx" },
    { mask: 0xf0ff, value: 0xf033, name: "LD B, Vx", description: "Store BCD representation of Vx in memory locations I, I+1, I+2" },
    { mask: 0xf0ff, value: 0xf055, name: "LD [I], Vx", description: "Store registers V0 through Vx in memory starting at location I" },
    { mask: 0xf0ff, value: 0xf065, name: "LD Vx, [I]", description: "Read registers V0 through Vx from memory starting at location I" },
];
