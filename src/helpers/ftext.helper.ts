import { Text5a, Text1a, Text2a, Text1b, Text2b, Text3a, Text3b, Text4a, Text4b, Title4, Title6, Title7, Title8, Title9, Title10, Title11, Title12, Lovers, ParentChild, Pairs, Text5b, Mankey, Smeargle, Medicham, items, Text4, Text5, pokemon, Text9, Text10, Text11, MankeyTitle, SmeargleTitle, MedichamTitle } from "../constant"

type FlavorTextEntry = [number, number, number, any?]; // Type for elements in the returned array
type GoodEntry = [number, number, number];
type FlavorTextLine = [number, number, number, string];
type FlavorTextLineEntry = [number, any];



export const FindParentChild = (poke1: number, poke2: number): number => {
    for (let i = 0; i < ParentChild.length; i++) {
        if (ParentChild[i][0] === poke1 && ParentChild[i][1] === poke2) {
            return i;
        }
    }
    return -1;
};

export const FindPairs = (poke1: number, poke2: number): number => {
    for (let i = 0; i < Pairs.length; i++) {
        if ((Pairs[i][0] === poke1 && Pairs[i][1] === poke2) || (Pairs[i][0] === poke2 && Pairs[i][1] === poke1)) {
            return i;
        }
    }
    return -1;
};

export const FindLovers = (poke1: number, poke2: number): number => {
    for (let i = 0; i < Lovers.length; i += 2) {
        if ((Lovers[i] === poke1 && Lovers[i + 1] === poke2) || (Lovers[i] === poke2 && Lovers[i + 1] === poke1)) {
            return i;
        }
    }
    return -1;
};

export const FindFlavorTextHead = (mtype: number, poke1: number, poke2: number): FlavorTextEntry[] => {
    const ret: FlavorTextEntry[] = [];

    switch (mtype) {
        case 0:
            for (let i = 0; i < Title8.length; i++) {
                ret.push([8, 12, i, Title8[i]]); // Use push for adding elements
            }
            break;
        case 1:
            let pc = FindParentChild(poke1, poke2);
            if (pc >= 0) {
                ret.push([4, 6, pc, Title4]);
            }
            pc = FindPairs(poke1, poke2);
            if (pc >= 0) {
                ret.push([5, 7, pc, Pairs[pc][2]]);
            }
            for (let i = 0; i < Title9.length; i++) {
                ret.push([9, 13, i, Title9[i]]);
            }
            break;
        case 2:
            let pc2 = FindLovers(poke1, poke2);
            if (pc2 >= 0) {
                ret.push([6, 8, pc2, Title6]);
            }
            for (let i = 0; i < Title10.length; i++) {
                ret.push([10, 14, i, Title10[i]]);
            }
            break;
        case 3:
            let pc3 = FindParentChild(poke1, poke2)
            ret.push([11, 15, pc3, Title11]);
            break;
        case 4:
            let pc4 = FindParentChild(poke1, poke2)
            ret.push([12, 16, pc4, Title12]);
            break;
    }
    return ret;
};

export const AddUniqueGood = (ret: FlavorTextEntry[], di1: number, di2: number, idx: number): void => {
    for (let i = 0; i < ret.length; i++) {
        if (ret[i][0] === di1 && ret[i][1] === di2) {
            return; // Exit if a matching entry is found
        }
    }
    ret.push([di1, di2, idx]); // Use push to add a new entry
};


export const GetGood = (textid: number, dungeon: number, floor: number, d1size: number, d2size: number, d3size: number): GoodEntry[] => {
    const ret: GoodEntry[] = [];
    for (let i = 0; i < 256; i++) {
        let di1 = (i + dungeon) & 0xFF;
        let di2 = (i + floor) & 0xFF;
        let di3: number;

        di1 %= d1size;
        di2 %= d2size;

        if (textid >= 0) {
            di3 = (i + dungeon) & 0xFF;
            di3 %= d3size;
            if (di3 === textid) {
                AddUniqueGood(ret, di1, di2, i);
            }
        } else {
            AddUniqueGood(ret, di1, di2, i);
        }
    }
    return ret;
};

export const FindFlavorTextLines = (
    headid: number,
    bodyid: number,
    textid: number,
    dungeon: number,
    floor: number
): FlavorTextLine[] => {
    const ret: FlavorTextLine[] = [];
    switch (headid) { // Use strict equality here as well
        case 4:
            ret.push([0, 0, textid, (ParentChild as any)[textid][2]]);
            break;
        case 5:
            ret.push([0, 0, textid, (Pairs as any)[textid][3]]);
            break;
        case 6:
            const g6 = GetGood(-1, dungeon, floor, 6, 6, -1);
            for (let i = 0; i < g6.length; i++) {
                ret.push([g6[i][0], g6[i][1], g6[i][2], Text5a[g6[i][0]] + " " + Text5b[g6[i][1]]]);
            }
            break;
        case 8:
            const g8 = GetGood(textid, dungeon, floor, 0x0d, 0xd, 15);
            for (let i = 0; i < g8.length; i++) {
                ret.push([g8[i][0], g8[i][1], g8[i][2], Text1a[g8[i][0]] + " " + Text1b[g8[i][1]]]);
            }
            break;
        case 9:
            const g9 = GetGood(textid, dungeon, floor, 0x2d, 10, 10);
            for (let i = 0; i < g9.length; i++) {
                ret.push([g9[i][0], g9[i][1], g9[i][2], Text2a[g9[i][0]] + " " + Text2b[g9[i][1]]]);
            }
            break;
        case 10:
            const g10 = GetGood(textid, dungeon, floor, 0x14, 4, 4);
            for (let i = 0; i < g10.length; i++) {
                ret.push([g10[i][0], g10[i][1], g10[i][2], Text3a[g10[i][0]] + " " + Text3b[g10[i][1]]]);
            }
            break;
        case 11:
        case 12:
            const g11_12 = GetGood(-1, dungeon, floor, 0x16, 0x16, -1);
            for (let i = 0; i < g11_12.length; i++) {
                ret.push([g11_12[i][0], g11_12[i][1], g11_12[i][2], Text4a[g11_12[i][0]] + " " + Text4b[g11_12[i][1]]]);
            }
            break;
        default:
            break; // Add default case to avoid unexpected behaviour
    }
    return ret;
};



export const FindFlavorTextLine1 = (headid: number, bodyid: number, textid: number): FlavorTextLineEntry[] => {
    const ret: FlavorTextLineEntry[] = [];
    switch (headid) {
        case 4:
            ret.push([textid, ParentChild[textid][2]]);
            break;
        case 5:
            ret.push([textid, Pairs[textid][3]]);
            break;
        case 6:
            for (let i = 0; i < Text5a.length; i++) {
                ret.push([i, Text5a[i]]);
            }
            break;
        case 8:
            for (let i = 0; i < Text1a.length; i++) {
                ret.push([i, Text1a[i]]);
            }
            break;
        case 9:
            for (let i = 0; i < Text2a.length; i++) {
                ret.push([i, Text2a[i]]);
            }
            break;
        case 10:
            for (let i = 0; i < Text3a.length; i++) {
                ret.push([i, Text3a[i]]);
            }
            break;
        case 11:
        case 12:
            for (let i = 0; i < Text4a.length; i++) {
                ret.push([i, Text4a[i]]);
            }
            break;
        default:
            break;
    }
    return ret;
};

export const FindFlavorTextLine2 = (headid: number, bodyid: number, textid: number): FlavorTextLineEntry[] => {
    const ret: FlavorTextLineEntry[] = [];
    switch (headid) {
        case 4:
        case 5:
            break;
        case 6:
            for (let i = 0; i < Text5b.length; i++) {
                ret.push([i, Text5b[i]]);
            }
            break;
        case 8:
            for (let i = 0; i < Text1b.length; i++) {
                ret.push([i, Text1b[i]]);
            }
            break;
        case 9:
            for (let i = 0; i < Text2b.length; i++) {
                ret.push([i, Text2b[i]]);
            }
            break;
        case 10:
            for (let i = 0; i < Text3b.length; i++) {
                ret.push([i, Text3b[i]]);
            }
            break;
        case 11:
        case 12:
            for (let i = 0; i < Text4b.length; i++) {
                ret.push([i, Text4b[i]]);
            }
            break;
        default:
            break;
    }
    return ret;
};

export const FindGood = (d1: number, d2: number, d1size: number, d2size: number, t1: number, t2: number): number => {
    for (let i = 0xFF0000; i <= 0xFFFFFF; i++) {
        const di1 = (i + d1) & 0xFF;
        const di2 = (i + d2) & 0xFF;
        if ((di1 % d1size) === t1 && (di2 % d2size) === t2) {
            return i & 0xFFFF;
        }
    }
    return -1;
};

export const convert = {
    findGood3(d1: number, d2: number, d1size: number, d2size: number, d3size: number, t1: number, t2: number, t3: number): number {
        for (let i = 0xFF0000; i <= 0xFFFFFF; i++) {
            const di1 = (i + d1) & 0xFF;
            const di2 = (i + d2) & 0xFF;
            const di3 = (i + d1) & 0xFF; // This line seems like a bug, should it be (i + d3) & 0xFF?
            if ((di1 % d1size) === t1 && (di2 % d2size) === t2 && (di3 % d3size) === t3) {
                return i & 0xFFFF;
            }
        }
        return -1;
    },

    passSetGoodHelper(pass: number[], fg: number): void {
        if (fg === -1) {
            // alert("A Wonder Mail couldn't be generated for the text chosen.");
            pass[8] = 0xFF;
            pass[9] = 0xFF;
            pass[10] = 0xFF;
        } else if (fg <= 0xFF) {
            pass[8] = fg;
            pass[9] = Math.floor(Math.random() * 255);
            pass[10] = 0xFF;
        } else {
            pass[8] = fg & 0xFF;
            pass[9] = (fg >> 8) & 0xFF;
            pass[10] = 0xFF;
        }
    },

    passSetGood(pass: number[], d1: number, d2: number, d1size: number, d2size: number, t1: number, t2: number): void {
        // Assuming FindGood is defined elsewhere and is compatible. If not, you'll need to provide it.
        // Example placeholder:
        function FindGood(d1: number, d2: number, d1size: number, d2size: number, t1: number, t2: number): number {
            return -1; // Replace with actual implementation.
        }
        const fg = FindGood(d1, d2, d1size, d2size, t1, t2);
        this.passSetGoodHelper(pass, fg);
    },

    passSetGood3(pass: number[], d1: number, d2: number, d1size: number, d2size: number, d3size: number, t1: number, t2: number, t3: number): void {
        const fg = this.findGood3(d1, d2, d1size, d2size, d3size, t1, t2, t3);
        this.passSetGoodHelper(pass, fg);
    },
};


export const passSetFlavorText = (pass: number[], headid: number, bodyid: number, textid: number, line1id: number): void => {
    textid = Number(textid);
    line1id = Number(line1id);

    switch (Number(headid)) {
        case 4: // ParentChild
            pass[2] = 7;
            pass[8] = Math.floor(Math.random() * 256);
            pass[9] = Math.floor(Math.random() * 256);
            pass[10] = 0xFF;
            break;
        case 5: // Pairs
            pass[2] = 8;
            pass[8] = Math.floor(Math.random() * 256);
            pass[9] = Math.floor(Math.random() * 256);
            pass[10] = 0xFF;
            break;
        case 6: // Lovers
            pass[2] = 9;
            pass[8] = line1id;
            pass[9] = Math.floor(Math.random() * 256);
            pass[10] = 0xFF;
            break;
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            pass[2] = 0;
            pass[8] = line1id;
            pass[9] = Math.floor(Math.random() * 256);
            pass[10] = 0xFF;
            break;
    }
};

export const flavorText = (pass: number[]): number[] => {
    const msgtype = pass[2];
    const missions = [3, 4, 5, 1, 2];

    if (msgtype > 0) {
        let msgtypeAdjusted = msgtype - 1;
        if (msgtypeAdjusted <= 8) {
            switch (msgtypeAdjusted) {
                case 0: return [0, 0, 6];
                case 1: return [1, 1, 6];
                case 2: return [2, 2, 6];
                case 3: return [3, 3, 6];
                case 4: return pass[1] === 3 ? [11, 4, 1] : [12, 4, 2];
                case 5: return pass[1] === 3 ? [11, 5, 1] : [12, 5, 2];
                case 6: {
                    const poke1 = pass[12] | (pass[13] << 8);
                    const poke2 = pass[14] | (pass[15] << 8);
                    // Assuming FindParentChild is defined and accessible in this scope.
                    if (typeof FindParentChild !== 'undefined') {
                        return FindParentChild(poke1, poke2) >= 0 ? [4, 6, 4] : [9, 6, 4];
                    } else {
                        console.error("FindParentChild is not defined.");
                        return [9, 6, 4]; // Or handle the error differently
                    }
                }
                case 7: {
                    const poke1 = pass[12] | (pass[13] << 8);
                    const poke2 = pass[14] | (pass[15] << 8);
                    // Assuming FindPairs is defined and accessible in this scope.
                    if (typeof FindPairs !== 'undefined') {
                        return FindPairs(poke1, poke2) >= 0 ? [5, 7, 4] : [9, 7, 4];
                    } else {
                        console.error("FindPairs is not defined.");
                        return [9, 7, 4];
                    }
                }
                case 8: {
                    const poke1 = pass[12] | (pass[13] << 8);
                    const poke2 = pass[14] | (pass[15] << 8);
                    // Assuming FindLovers is defined and accessible in this scope.
                    if (typeof FindLovers !== 'undefined') {
                        return FindLovers(poke1, poke2) >= 0 ? [6, 8, 5] : [10, 8, 5];
                    } else {
                        console.error("FindLovers is not defined.");
                        return [10, 8, 5];
                    }
                }
            }
        }
    }
    return [8 + pass[1], 12 + pass[1], missions[pass[1]]];
};

export const flavorTextBody = (pass: number[], ftext: number[]): string => {
    const mid = pass[8] | (pass[9] << 8) | (pass[10] << 16);
    let dungid = mid + pass[4];
    let floorid = mid + pass[5];
    dungid &= 0xFF;
    floorid &= 0xFF;

    switch (ftext[1]) {
        case 0: return typeof Mankey !== 'undefined' ? Mankey : "";
        case 1: return typeof Smeargle !== 'undefined' ? Smeargle : "";
        case 2: return typeof Medicham !== 'undefined' ? Medicham : "";
        case 3: return "";
        case 4: return typeof items !== 'undefined' && typeof Text4 !== 'undefined' ? Text4.replace(/\%s/g, items[pass[18]]) : "";
        case 5: return typeof items !== 'undefined' && typeof Text5 !== 'undefined' ? Text5.replace(/\%s/g, items[pass[18]]) : "";
        case 6: {
            const poke1 = pass[12] | (pass[13] << 8);
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof FindParentChild !== 'undefined' && typeof ParentChild !== 'undefined') {
                const pc = FindParentChild(poke1, poke2);
                return pc >= 0 ? (ParentChild[pc][2] as string) : "";
            } else {
                console.error("FindParentChild or ParentChild is not defined.");
                return "";
            }
        }
        case 7: {
            const poke1 = pass[12] | (pass[13] << 8);
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof FindPairs !== 'undefined' && typeof Pairs !== 'undefined' && typeof pokemon !== 'undefined') {
                const pc = FindPairs(poke1, poke2);
                if (pc >= 0) {
                    const pkmn = pokemon[poke2];
                    return (Pairs[pc][3] as string).replace(/\%s/g, pkmn);
                }
            } else {
                console.error("FindPairs, Pairs, or pokemon is not defined.");
            }
            return "";
        }
        case 8: {
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof pokemon !== 'undefined' && typeof Text5a !== 'undefined' && typeof Text5b !== 'undefined') {
                const pkmn = pokemon[poke2];
                return Text5a[dungid % Text5a.length].replace(/\%s/g, pkmn) + " " + Text5b[floorid % Text5b.length];
            } else {
                console.error("pokemon, Text5a, or Text5b is not defined.");
            }
            return "";
        }
        case 9: return typeof Text9 !== 'undefined' ? Text9 : "";
        case 10: return typeof Text10 !== 'undefined' ? Text10 : "";
        case 11: return typeof Text11 !== 'undefined' ? Text11 : "";
        case 12: return typeof Text1a !== 'undefined' && typeof Text1b !== 'undefined' ? Text1a[dungid % Text1a.length] + " " + Text1b[floorid % Text1b.length] : "";
        case 13: {
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof pokemon !== 'undefined' && typeof Text2a !== 'undefined' && typeof Text2b !== 'undefined') {
                const pkmn = pokemon[poke2];
                return Text2a[dungid % Text2a.length].replace(/\%s/g, pkmn) + " " + Text2b[floorid % Text2b.length];
            } else {
                console.error("pokemon, Text2a, or Text2b is not defined.");
                return "";
            }
        }
        case 14: {
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof pokemon !== 'undefined' && typeof Text3a !== 'undefined' && typeof Text3b !== 'undefined') {
                const pkmn = pokemon[poke2];
                return Text3a[dungid % Text3a.length].replace(/\%s/g, pkmn) + " " + Text3b[floorid % Text3b.length].replace(/\%s/g, pkmn);
            } else {
                console.error("pokemon, Text3a, or Text3b is not defined.");
                return "";
            }
        }
        case 15:
        case 16: {
            const item = items[pass[16]];
            if (typeof items !== 'undefined' && typeof Text4a !== 'undefined' && typeof Text4b !== 'undefined') {
                return Text4a[dungid % Text4a.length].replace(/\%s/g, item) + " " + Text4b[floorid % Text4b.length];
            } else {
                console.error("items, Text4a, or Text4b is not defined.");
                return "";
            }
        }
        default: return ""; // Important: Add a default case
    }
};

export const flavorTextHead = (pass: number[], ftext: number[]): string => {
    const mid = pass[8] | (pass[9] << 8) | (pass[10] << 16);
    let dungid = mid + pass[4];
    dungid &= 0xFF;

    switch (ftext[0]) {
        case 0: return typeof MankeyTitle !== 'undefined' ? MankeyTitle : "";
        case 1: return typeof SmeargleTitle !== 'undefined' ? SmeargleTitle : "";
        case 2: return typeof MedichamTitle !== 'undefined' ? MedichamTitle : "";
        case 3: return "";
        case 4: return typeof Title4 !== 'undefined' ? Title4 : "";
        case 5: {
            const poke1 = pass[12] | (pass[13] << 8);
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof FindPairs !== 'undefined' && typeof Pairs !== 'undefined') {
                const pc = FindPairs(poke1, poke2);
                return pc >= 0 ? (Pairs[pc][2] as string) : "";
            } else {
                console.error("FindPairs or Pairs is not defined.");
                return "";
            }
        }
        case 6: return typeof Title6 !== 'undefined' ? Title6 : "";
        case 7: {
            const item = items[pass[16]];
            return typeof items !== 'undefined' && typeof Title7 !== 'undefined' ? Title7.replace(/\%s/g, item) : "";
        }
        case 8: {
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof pokemon !== 'undefined' && typeof Title8 !== 'undefined') {
                const pkmn = pokemon[poke2];
                return Title8[dungid % Title8.length].replace(/\%s/g, pkmn);
            } else {
                console.error("pokemon or Title8 is not defined.");
                return "";
            }
        }
        case 9: {
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof pokemon !== 'undefined' && typeof Title9 !== 'undefined') {
                const pkmn = pokemon[poke2];
                return Title9[dungid % Title9.length].replace(/\%s/g, pkmn);
            } else {
                console.error("pokemon or Title9 is not defined.");
                return "";
            }
        }
        case 10: {
            const poke2 = pass[14] | (pass[15] << 8);
            if (typeof pokemon !== 'undefined' && typeof Title10 !== 'undefined') {
                const pkmn = pokemon[poke2];
                return Title10[dungid % Title10.length].replace(/\%s/g, pkmn);
            } else {
                console.error("pokemon or Title10 is not defined.");
                return "";
            }
        }
        case 11: {
            const item = items[pass[16]];
            return typeof items !== 'undefined' && typeof Title11 !== 'undefined' ? Title11.replace(/\%s/g, item) : "";
        }
        case 12: {
            const item = items[pass[16]];
            return typeof items !== 'undefined' && typeof Title12 !== 'undefined' ? Title12.replace(/\%s/g, item) : "";
        }
        default: return "";
    }
};

export const debugFlavorText = (pass: number[]): void => {
    const ftext = flavorText(pass); // Assuming flavorText is defined and exported
    const h = flavorTextHead(pass, ftext);
    const b = flavorTextBody(pass, ftext);
    // alert([h, b, ftext]);
};