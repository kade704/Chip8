import { INSTRUCTIONS } from "../constants/instructions";

export function decodeOpcode(opcode: number): string {
    const x = (opcode & 0x0f00) >> 8;
    const y = (opcode & 0x00f0) >> 4;
    const n = opcode & 0x000f;
    const kk = opcode & 0x00ff;
    const nnn = opcode & 0x0fff;

    const nnnStr = nnn.toString(16).toUpperCase().padStart(3, "0");
    const kkStr = kk.toString(16).toUpperCase().padStart(2, "0");
    const xStr = `V${x.toString(16).toUpperCase()}`;
    const yStr = `V${y.toString(16).toUpperCase()}`;
    const nStr = n.toString(16).toUpperCase().padStart(1, "0");

    let instruction = null;
    for (const inst of INSTRUCTIONS) {
        if ((opcode & inst.mask) === inst.value) {
            instruction = inst;
        }
    }

    if (!instruction) {
        return "??";
    }

    switch (instruction.name) {
        case "CLS":
            return "CLS";
        case "RET":
            return "RET";
        case "JP addr":
            return `JP 0x${nnnStr}`;
        case "CALL addr":
            return `CALL 0x${nnnStr}`;
        case "SE Vx, byte":
            return `SE ${xStr}, 0x${kkStr}`;
        case "SNE Vx, byte":
            return `SNE ${xStr}, 0x${kkStr}`;
        case "SE Vx, Vy":
            return `SE ${xStr}, ${yStr}`;
        case "LD Vx, byte":
            return `LD ${xStr}, 0x${kkStr}`;
        case "ADD Vx, byte":
            return `ADD ${xStr}, 0x${kkStr}`;
        case "LD Vx, Vy":
            return `LD ${xStr}, ${yStr}`;
        case "OR Vx, Vy":
            return `OR ${xStr}, ${yStr}`;
        case "AND Vx, Vy":
            return `AND ${xStr}, ${yStr}`;
        case "XOR Vx, Vy":
            return `XOR ${xStr}, ${yStr}`;
        case "ADD Vx, Vy":
            return `ADD ${xStr}, ${yStr}`;
        case "SUB Vx, Vy":
            return `SUB ${xStr}, ${yStr}`;
        case "SHR Vx":
            return `SHR ${xStr}`;
        case "SUBN Vx, Vy":
            return `SUBN ${xStr}, ${yStr}`;
        case "SHL Vx":
            return `SHL ${xStr}`;
        case "LD I, addr":
            return `LD I, 0x${nnnStr}`;
        case "JP V0, addr":
            return `JP V0, 0x${nnnStr}`;
        case "RND Vx, byte":
            return `RND ${xStr}, 0x${kkStr}`;
        case "DRW Vx, Vy, N":
            return `DRW ${xStr}, ${yStr}, 0x${nStr}`;
        case "SKP Vx":
            return `SKP ${xStr}`;
        case "SKNP Vx":
            return `SKNP ${xStr}`;
        case "LD Vx, DT":
            return `LD ${xStr}, DT`;
        case "LD Vx, K":
            return `LD ${xStr}, K`;
        case "LD DT, Vx":
            return `LD DT, ${xStr}`;
        case "LD ST, Vx":
            return `LD ST, ${xStr}`;
        case "ADD I, Vx":
            return `ADD I, ${xStr}`;
        case "LD F, Vx":
            return `LD F, ${xStr}`;
        case "LD B, Vx":
            return `LD B, ${xStr}`;
        case "LD [I], Vx":
            return `LD [I], ${xStr}`;
        case "LD Vx, [I]":
            return `LD ${xStr}, [I]`;
        default:
            return "??";
    }
}

export function encodeOpcode(instruction: string): number | null {
    const instructionUpper = instruction.toUpperCase().trim();

    const parseHex = (s: string) => parseInt(s, 16);
    const parseReg = (s: string) => parseHex(s.substring(1));

    const instructionPatterns: { regex: RegExp; encoder: (m: string[]) => number }[] = [
        { regex: /^CLS$/, encoder: () => 0x00e0 },
        { regex: /^RET$/, encoder: () => 0x00ee },

        { regex: /^JP (0X[0-9A-F]{1,3}|[0-9]+)$/, encoder: (m) => 0x1000 | (parseInt(m[1]) & 0x0fff) },
        { regex: /^CALL (0X[0-9A-F]{1,3}|[0-9]+)$/, encoder: (m) => 0x2000 | (parseInt(m[1]) & 0x0fff) },

        {
            regex: /^SE (V[0-9A-F]), (0X[0-9A-F]{1,2}|[0-9]+)$/,
            encoder: (m) => 0x3000 | (parseReg(m[1]) << 8) | (parseInt(m[2]) & 0xff),
        },
        {
            regex: /^SNE (V[0-9A-F]), (0X[0-9A-F]{1,2}|[0-9]+)$/,
            encoder: (m) => 0x4000 | (parseReg(m[1]) << 8) | (parseInt(m[2]) & 0xff),
        },

        {
            regex: /^SE (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x5000 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        {
            regex: /^SNE (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x9000 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },

        {
            regex: /^LD (V[0-9A-F]), (0X[0-9A-F]{1,2}|[0-9]+)$/,
            encoder: (m) => 0x6000 | (parseReg(m[1]) << 8) | (parseInt(m[2]) & 0xff),
        },

        {
            regex: /^ADD (V[0-9A-F]), (0X[0-9A-F]{1,2}|[0-9]+)$/,
            encoder: (m) => 0x7000 | (parseReg(m[1]) << 8) | (parseInt(m[2]) & 0xff),
        },

        {
            regex: /^LD (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x8000 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        {
            regex: /^OR (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x8001 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        {
            regex: /^AND (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x8002 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        {
            regex: /^XOR (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x8003 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        {
            regex: /^ADD (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x8004 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        {
            regex: /^SUB (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x8005 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        { regex: /^SHR (V[0-9A-F])$/, encoder: (m) => 0x8006 | (parseReg(m[1]) << 8) },
        {
            regex: /^SUBN (V[0-9A-F]), (V[0-9A-F])$/,
            encoder: (m) => 0x8007 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4),
        },
        { regex: /^SHL (V[0-9A-F])$/, encoder: (m) => 0x800e | (parseReg(m[1]) << 8) },

        { regex: /^LD I, (0X[0-9A-F]{1,3}|[0-9]+)$/, encoder: (m) => 0xa000 | (parseInt(m[1]) & 0x0fff) },

        { regex: /^JP V0, (0X[0-9A-F]{1,3}|[0-9]+)$/, encoder: (m) => 0xb000 | (parseInt(m[1]) & 0x0fff) },

        {
            regex: /^RND (V[0-9A-F]), (0X[0-9A-F]{1,2}|[0-9]+)$/,
            encoder: (m) => 0xc000 | (parseReg(m[1]) << 8) | (parseInt(m[2]) & 0xff),
        },

        {
            regex: /^DRW (V[0-9A-F]), (V[0-9A-F]), (0X[0-9A-F]{1}|[0-9]+)$/,
            encoder: (m) => 0xd000 | (parseReg(m[1]) << 8) | (parseReg(m[2]) << 4) | (parseInt(m[3]) & 0xf),
        },

        { regex: /^SKP (V[0-9A-F])$/, encoder: (m) => 0xe09e | (parseReg(m[1]) << 8) },
        { regex: /^SKNP (V[0-9A-F])$/, encoder: (m) => 0xe0a1 | (parseReg(m[1]) << 8) },

        { regex: /^LD (V[0-9A-F]), DT$/, encoder: (m) => 0xf007 | (parseReg(m[1]) << 8) },
        { regex: /^LD (V[0-9A-F]), K$/, encoder: (m) => 0xf00a | (parseReg(m[1]) << 8) },
        { regex: /^LD DT, (V[0-9A-F])$/, encoder: (m) => 0xf015 | (parseReg(m[1]) << 8) },
        { regex: /^LD ST, (V[0-9A-F])$/, encoder: (m) => 0xf018 | (parseReg(m[1]) << 8) },
        { regex: /^ADD I, (V[0-9A-F])$/, encoder: (m) => 0xf01e | (parseReg(m[1]) << 8) },
        { regex: /^LD F, (V[0-9A-F])$/, encoder: (m) => 0xf029 | (parseReg(m[1]) << 8) },
        { regex: /^LD B, (V[0-9A-F])$/, encoder: (m) => 0xf033 | (parseReg(m[1]) << 8) },
        { regex: /^LD \[I\], (V[0-9A-F])$/, encoder: (m) => 0xf055 | (parseReg(m[1]) << 8) },
        { regex: /^LD (V[0-9A-F]), \[I\]$/, encoder: (m) => 0xf065 | (parseReg(m[1]) << 8) },
    ];

    for (const pattern of instructionPatterns) {
        const match = instructionUpper.match(pattern.regex);
        if (match) {
            return pattern.encoder(match);
        }
    }

    return null;
}
