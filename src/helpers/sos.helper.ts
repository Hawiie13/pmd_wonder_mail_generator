import { chars, charto, codeswitch, wondercode, a8, } from "../constant"

interface AState {
    buf: Uint8Array;
    ptr: number;
    bit: number;
    totalbits: number;
}

export const c2c = (s: string, c: number): number => {
    return parseInt(s.substr(c << 1, 2), 16);
};

export const c2w = (s: string, c: number): number => {
    return c2c(s, c << 1) | (c2c(s, (c << 1) + 1) << 8);
};


export const CharToCode = (c: number): number => {
    return parseInt(charto.substr(c << 1, 2), 16);
};

export const encodebits = (astate: AState, aout: Uint8Array, aoutStart: number, iter: number): void => {
    let bit = 0;
    let pointer = aoutStart;
    for (let i = 0; i < iter; i++) {
        const nextbyte = aout[pointer];
        const nextbit = nextbyte >> bit;
        if (nextbit & 1) {
            astate.buf[astate.ptr] |= (1 << astate.bit);
        }
        bit++;
        if (bit === 8) {
            pointer++;
            bit = 0;
        }
        astate.bit++;
        if (astate.bit === 8) {
            astate.ptr++;
            astate.bit = 0;
        }
        astate.totalbits++;
    }
};

export const decodebits = (astate: AState, aout: Uint8Array, aoutStart: number, iter: number): void => {
    let bit = 0;
    let pointer = aoutStart;
    for (let i = 0; i < iter; i++) {
        if (bit === 0) {
            aout[pointer] = 0;
        }
        const nextbyte = astate.buf[astate.ptr];
        const nextbit = nextbyte >> astate.bit;
        if (nextbit & 1) {
            aout[pointer] |= (1 << bit);
        }
        bit++;
        if (bit === 8) {
            pointer++;
            bit = 0;
        }
        astate.bit++;
        if (astate.bit === 8) {
            astate.ptr++;
            astate.bit = 0;
        }
        astate.totalbits++;
    }
};


export const dobits = (astate: AState, aout: Uint8Array): void => {
    for (let i = 0; i < 0x38; i++) {
        aout[i] = 0;
    }

    decodebits(astate, aout, 0, 4);
    decodebits(astate, aout, 4, 7);
    decodebits(astate, aout, 5, 7);
    decodebits(astate, aout, 8, 0x18);
    decodebits(astate, aout, 12, 9);
    decodebits(astate, aout, 16, 0x20);
    decodebits(astate, aout, 20, 0x50);
    decodebits(astate, aout, 32, 8);
    decodebits(astate, aout, 33, 8);
    decodebits(astate, aout, 34, 8);
    decodebits(astate, aout, 36, 32);
    decodebits(astate, aout, 40, 32);
    decodebits(astate, aout, 44, 8);

    const last: Uint8Array = new Uint8Array(1); // Create a Uint8Array for last
    decodebits(astate, last, 0, 1);
    aout[45] = last[0] & 1;
};

export const dobitsrev = (astate: AState, aout: Uint8Array): void => {
    // Initialize astate.buf with zeros
    astate.buf = new Uint8Array(0x22);

    encodebits(astate, aout, 0, 4);
    encodebits(astate, aout, 4, 7);
    encodebits(astate, aout, 5, 7);
    encodebits(astate, aout, 8, 0x18);
    encodebits(astate, aout, 12, 9);
    encodebits(astate, aout, 16, 0x20);
    encodebits(astate, aout, 20, 0x50);
    encodebits(astate, aout, 32, 8);
    encodebits(astate, aout, 33, 8);
    encodebits(astate, aout, 34, 8);
    encodebits(astate, aout, 36, 32);
    encodebits(astate, aout, 40, 32);
    encodebits(astate, aout, 44, 8);
    encodebits(astate, aout, 45, 1);
};

export const wonderbits = (astate: AState, aout: Uint8Array): void => {
    for (let i = 0; i < 0x14; i++) {
        aout[i] = 0;
    }

    decodebits(astate, aout, 0, 4);
    decodebits(astate, aout, 1, 3);
    decodebits(astate, aout, 2, 4);
    decodebits(astate, aout, 0x0c, 9);
    decodebits(astate, aout, 0x0e, 9);
    decodebits(astate, aout, 0x10, 8);
    decodebits(astate, aout, 0x11, 4);
    decodebits(astate, aout, 0x12, 8);
    decodebits(astate, aout, 0x13, 6);
    decodebits(astate, aout, 0x08, 0x18);
    decodebits(astate, aout, 4, 7);
    decodebits(astate, aout, 5, 7);
};


export const wonderbitsrev = (astate: AState, aout: Uint8Array): void => {
    // Initialize astate.buf with zeros
    astate.buf = new Uint8Array(0x0F);

    encodebits(astate, aout, 0, 4);
    encodebits(astate, aout, 1, 3);
    encodebits(astate, aout, 2, 4);
    encodebits(astate, aout, 0x0c, 9);
    encodebits(astate, aout, 0x0e, 9);
    encodebits(astate, aout, 0x10, 8);
    encodebits(astate, aout, 0x11, 4);
    encodebits(astate, aout, 0x12, 8);
    encodebits(astate, aout, 0x13, 6);
    encodebits(astate, aout, 0x08, 0x18);
    encodebits(astate, aout, 4, 7);
    encodebits(astate, aout, 5, 7);
};

export const tostr = (x: any[]): string => {
    const nx: string[] = [];
    for (let i = 0; i < x.length; i++) {
        if (typeof x[i] !== 'undefined') {
            nx[i] = x[i].toString(16).padStart(2, '0');
        }
    }
    return nx.join(",");
};

export const str2arr = (x: number[] | string): string[] => {

    const arr: string[] = [];
    if (Array.isArray(x)) return x.map(i => i.toString())

    for (let i = 0; i < x.length; i++) {
        arr.push(x.charAt(i));
    }
    return arr;
};

export const convpasshelper = (src: string[], dst: Uint8Array, size: number): number => {
    const codes: number[] = [];
    const astate: AState = { buf: new Uint8Array(0), ptr: 0, bit: 0, totalbits: 0 };

    for (let i = 0; i < size; i++) {
        const tos = CharToCode(src[i].charCodeAt(0));
        codes[i] = tos;
        if (tos === 0xff) {
            return 0;
        }
    }

    let r2 = size * 5 + 5;
    if (r2 < 0) {
        r2 += 7;
    }
    r2 >>= 3;
    astate.buf = new Uint8Array(r2);

    for (let i = 0; i < size; i++) {
        encodebits(astate, (codes as any), i, 5);
    }

    dst.set(astate.buf);
    return 1;
};

export const convertpass = (pass: string, aout: Uint8Array): number => {
    if (pass.length < 0x36) {
        return 0;
    }

    const newpass: string[] = [];
    const passArr: string[] = str2arr(pass);

    for (let i = 0; i < 0x36; i++) {
        const offset = c2c(codeswitch, i);
        newpass[i] = passArr[offset];
    }

    const code: Uint8Array = new Uint8Array(0x22);
    if (!convpasshelper(newpass, code, 0x36)) {
        return 0;
    }

    let sum = 0;
    for (let i = 1; i < 0x22; i++) {
        sum += code[i] + i;
        sum &= 0xFF;
    }

    if (sum !== code[0]) {
        return 0;
    }

    const astate: AState = { buf: code.slice(1), ptr: 0, bit: 0, totalbits: 0 };
    dobits(astate, aout);
    return 1;
};

export const datatopass = (pass: string): string => {
    const astate: AState = { buf: new Uint8Array(0), ptr: 0, bit: 0, totalbits: 0 };
    const astate2: AState = { buf: new Uint8Array(0), ptr: 0, bit: 0, totalbits: 0 };
    const codes: any[] = [];
    const retpass: string[] = [];

    dobitsrev(astate, str2arr(pass) as any);

    let sum = 0;
    for (let i = 0; i < 0x21; i++) {
        sum += astate.buf[i] + (i + 1);
        sum &= 0xFF;
    }

    astate2.buf = new Uint8Array(0x22);
    astate2.buf[0] = sum;
    for (let i = 1; i < 0x22; i++) {
        astate2.buf[i] = astate.buf[i - 1];
    }

    for (let i = 0; i < 0x36; i++) {
        decodebits(astate2, (codes as any), i, 5);
    }

    for (let i = 0; i < 0x36; i++) {
        codes[i] = chars.charAt(codes[i]);
    }

    for (let i = 0; i < 0x36; i++) {
        let offset = 0;
        for (let j = 0; j < 0x36; j++) {
            if (c2c(codeswitch, j) === i) {
                offset = j;
                break;
            }
        }
        retpass[i] = codes[offset];
    }

    return retpass.join("");
};


export const convertwonderpass = (pass: string, aout: Uint8Array): number => {
    if (pass.length < 0x18) {
        return 0;
    }

    const newpass: string[] = [];
    const passArr: string[] = str2arr(pass);

    for (let i = 0; i < 0x18; i++) {
        const offset = c2c(wondercode, i);
        newpass[i] = passArr[offset];
    }

    const code: Uint8Array = new Uint8Array(0x0F);
    if (!convpasshelper(newpass, code, 0x18)) {
        return 0;
    }

    let sum = 0;
    for (let i = 1; i < 0x0F; i++) {
        sum += code[i] + i;
        sum &= 0xFF;
    }

    if (sum !== code[0]) {
        return 0;
    }

    const astate: AState = { buf: code.slice(1), ptr: 0, bit: 0, totalbits: 0 };
    wonderbits(astate, aout);
    return 1;
};

export const datatowonderpass = (pass: number[]): string => {
    const astate: AState = { buf: new Uint8Array(0), ptr: 0, bit: 0, totalbits: 0 };
    const astate2: AState = { buf: new Uint8Array(0), ptr: 0, bit: 0, totalbits: 0 };
    const codes: any[] = [];
    const retpass: string[] = [];

    wonderbitsrev(astate, str2arr(pass) as any);

    let sum = 0;
    for (let i = 0; i < 0x0E; i++) {
        sum += astate.buf[i] + (i + 1);
        sum &= 0xFF;
    }

    astate2.buf = new Uint8Array(0x0F);
    astate2.buf[0] = sum;
    for (let i = 1; i < 0x0F; i++) {
        astate2.buf[i] = astate.buf[i - 1];
    }

    for (let i = 0; i < 0x18; i++) {
        decodebits(astate2, (codes as any), i, 5);
    }

    for (let i = 0; i < 0x18; i++) {
        codes[i] = chars.charAt(codes[i]);
    }

    for (let i = 0; i < 0x18; i++) {
        let offset = 0;
        for (let j = 0; j < 0x18; j++) {
            if (c2c(wondercode, j) === i) {
                offset = j;
                break;
            }
        }
        retpass[i] = codes[offset];
    }

    return retpass.join("");
};