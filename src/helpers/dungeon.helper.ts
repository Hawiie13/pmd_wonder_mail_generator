import { DungeonItems, AboveGround, debug, baditems, baddungeons, badpokemon, pokemon, dungeons, floors, items, friendareas, wonderMailText, pokedex } from "../constant";
import { GetDifficulty, c2c, c2w, datatowonderpass, tostr } from ".";
import { FindFlavorTextHead, FindFlavorTextLines, flavorText, flavorTextBody, flavorTextHead, passSetFlavorText } from "./ftext.helper";

export interface FormData {
    missionType: number;
    client: number;
    otherPokemon: number;
    dungeon: number;
    floor: number;
    itemToFind: number;
    itemReward: number;
    itemRewardMoney: boolean;
    friendAreaReward: number;
    messageTitle: string;
    messageBody: string
}

export const ItemInDungeon = (item: number, dungeon: number): boolean => {
    if (item <= 0 || dungeon >= DungeonItems.length) {
        return false;
    }

    const dungeonItems = DungeonItems[dungeon];
    return dungeonItems.includes(item);
}

export const IsAboveGround = (d: number): number => {
    if (d >= AboveGround.length) {
        return 1; // Return 1 if d is out of bounds
    }
    return AboveGround[d]; // Return the floor string
}

export const entrytopass = (x: string) => {
    x = x.replace(/[\n\s\r\'\"]/g, "")
        .replace(/[\u2642]/g, "#")
        .replace(/[\u2640]/g, "%")
        .replace(/[\{\(\[]m(ale?)?[\)\]\}]/gi, "#")
        .replace(/[\{\(\[]f(em(ale)?)?[\)\]\}]/gi, "%")
        .replace(/[\{\(\[]\.\.?\.?[\)\]\}]/g, ".")
        .replace(/[\{\(\[][\u2026][\)\]\}]/g, ".")
        .replace(/[\u2026]/g, ".")
        .toUpperCase()
    return x
}

export const formatpass = (x: string) => {
    x = entrytopass(x)
    x = passwordReplacer(x)
    return x.substr(0, 4) + " " +
        x.substr(4, 4) + " " +
        x.substr(8, 4) + "\r\n" +
        x.substr(12, 4) + " " +
        x.substr(16, 4) + " " +
        x.substr(20, 4) + "\r\n"
}

export const isbaditem = (x: number): 0 | 1 => {
    if (x >= 0xF0) {
        return 0;
    }

    for (let i = 0; i < baditems.length / 2; i++) {
        const combinedValue = c2c(baditems, i);
        if (isNaN(combinedValue)) {
            continue; // Skip to the next iteration if c2c returned NaN
        }
        if (x === combinedValue) {
            return 1;
        }
    }

    return 0;
}

export const isbaddungeon = (x: number): 0 | 1 => {
    if (x > 0x3F) {
        return 1;
    }

    for (let i = 0; i < baddungeons.length / 2; i++) {
        const combinedValue = c2c(baddungeons, i);
        if (isNaN(combinedValue)) {
            continue;
        }
        if (x === combinedValue) {
            return 1;
        }
    }

    return 0;
};

export const getspecies = (id: number): number => {
    if (id === 0x179 || id === 0x17A || id === 0x17B) {
        return 0x178;
    }
    if ((id >= 0xCA && id <= 0xE2) || id === 0x19F || id === 0x1A0) {
        return 201; // You can also use 0xC9 if you prefer hex
    }
    if (id === 0x1A1 || id === 0x1A2 || id === 0x1A3) {
        return 0x19E;
    }
    if (id === 0x1A7) {
        return 0x19C;
    }
    return id;
};

const isbadpokemon = (x: number): 0 | 1 => {
    if (getspecies(x) !== x) {
        return 1;
    }

    for (let i = 0; i < badpokemon.length / 2; i++) {
        const combinedValue = c2w(badpokemon, i);
        if (isNaN(combinedValue)) {
            continue;
        }
        if (x === combinedValue) {
            return 1;
        }
    }

    return 0;
};

export const optionarray = (x: string): number[] => {
    return x.split(",").map(Number);
};

export const pkmnsort = (a: any, b: any) => {
    if (a[1] == b[1]) return 0
    return (a[1] < b[1]) ? -1 : 1
}


export const showpkmn = () => {
    var poke = []
    for (var i = 0; i < pokemon.length; i++) {
        if (i == 0 || !isbadpokemon(i)) {
            poke[poke.length] = [i, pokemon[i]]
        }
    }
    poke = poke.sort(pkmnsort)
    return poke.map(pkmn => ({ value: pkmn[0], label: pkmn[1] }))
}


export const showdungeon = () => dungeons.map((dungeon, i) => ({ label: dungeon, value: i }))

export const showfloors = (formData: FormData) => {
    const { dungeon } = formData
    var numfloors = c2c(floors, dungeon);
    const floorNumbers = []
    for (var i = 1; i < numfloors; i++) {
        floorNumbers.push({ label: i.toString(), value: i })
    }
    return floorNumbers
}

export const showrewards = () => {
    const itemList = []
    for (var i = 0; i < items.length; i++) {
        if (!isbaditem(i)) {
            itemList.push({ value: i, label: items[i] })
        }
    }
    return itemList
}

export const showfind2 = (formData: FormData) => {
    const { dungeon, missionType } = formData
    const dungeonItems = []
    var len = 0
    for (var i = 0; i < items.length; i++) {
        if (!isbaditem(i) && i != 0x69 && i != 0x7c && (i == 0 || i >= 9)) {
            if (missionType != 3 || ItemInDungeon(i, dungeon)) {
                dungeonItems.push({ label: items[i], value: i })
            }
        }
    }

    return dungeonItems
}

export const showareas = () => {
    const areaList = [{ label: "-------", value: -1 }]
    for (var i = 0; i < friendareas.length; i++) {
        if (i == 10 || i == 14 || i == 35 || i == 36) {
            areaList.push({ label: friendareas[i], value: i })
        }
    }
    return areaList
}

export const showftext = (formData: FormData, typechanged = 1) => {
    const mtype = Number(formData.missionType)
    const poke1 = formData.client
    const poke2 = formData.otherPokemon
    const item = items[formData.itemToFind]
    const fthead = FindFlavorTextHead(mtype, poke1, poke2)
    const showFTextList = []
    var len = 0
    for (var i = 0; i < fthead.length; i++) {
        var optstr = fthead[i][0] + "," + fthead[i][1] + "," + fthead[i][2]
        var ftext = fthead[i][3]
        if (mtype == 3 || mtype == 4) {
            ftext = ftext.replace(/\%s/g, item)
        } else {
            ftext = ftext.replace(/\%s/g, pokemon[poke2])
        }
        ftext = ftext.replace(/\&\#x2642\;/g, "\u2642")
        ftext = ftext.replace(/\&\#x2640\;/g, "\u2640")
        showFTextList.push({ label: ftext, value: optstr })
    }

    return showFTextList
}

export const updateftext = (formData: FormData) => {
    const mtype = Number(formData.missionType)
    const poke1 = formData.client
    const poke2 = formData.otherPokemon
    const dungeon = formData.dungeon
    const floor = formData.floor
    const item = items[formData.itemToFind]
    let headinfo = formData.messageTitle
    let oldsel, newsel = 0
    const messageBodyList = []
    const parsedHeaderInfo = headinfo.split(",")
    var fthead = FindFlavorTextLines(
        Number(parsedHeaderInfo[0]), Number(parsedHeaderInfo[1]), Number(parsedHeaderInfo[2]),
        dungeon, floor)
    oldsel = optionarray(headinfo)
    var len = 0
    for (var i = 0; i < fthead.length; i++) {
        var optstr = [fthead[i][0], fthead[i][1], fthead[i][2]].join(",")
        var ftext = fthead[i][3]
        if ([3, 4].includes(mtype)) {
            ftext = ftext.replace(/\%s/g, item.toString())
        } else {
            ftext = ftext.replace(/\%s/g, pokemon[poke2])
        }
        if (oldsel.length > 0) {
            if (oldsel[0] == fthead[i][0] &&
                oldsel[1] == fthead[i][1]) {
                newsel = len
            }
        }
        ftext = ftext.replace(/\&\#x2642\;/g, "♀")
        ftext = ftext.replace(/\&\#x2640\;/g, "♂")
        ftext = ftext.replace(/<!\-\-break\-\->/g, "")
        messageBodyList.push({ label: ftext, value: optstr })
    }
    // if (oldsel.length > 0)
    //     f.mline1.selectedIndex = newsel
    return messageBodyList
}

export const genwonder = (formData: FormData) => {
    var pass: number[] = []
    const msg = { title: "Error", message: "" }
    for (var i = 0; i < 20; i++) {
        pass[i] = 0
    }
    pass[0] = 5
    pass[1] = Number(formData.missionType)
    pass[4] = formData.dungeon
    pass[5] = formData.floor
    pass[2] = 0
    pass[8] = 0xFF
    pass[9] = 0xFF
    pass[10] = 0xFF
    setpass(formData, pass)
    var client = Number(formData.client)
    if (client == 0) {
        msg.message = wonderMailText.ChooseClient
        return msg
    }
    pass[12] = client & 0xFF
    pass[13] = (client >> 8) & 0xFF
    if ([1, 2].includes(pass[1])) {
        var otherMons = Number(formData.otherPokemon)
        if (otherMons == 0) {
            // alert(ChooseTarget)
            msg.message = wonderMailText.ChooseTarget
            return msg
        }
        pass[14] = otherMons & 0xFF
        pass[15] = (otherMons >> 8) & 0xFF
    } else {
        pass[14] = pass[12]
        pass[15] = pass[13]
    }
    if ([3, 4].includes(pass[1])) {
        pass[16] = formData.itemToFind
        if (pass[16] == 0) {
            msg.message = wonderMailText.ChooseItem
            return msg
        } else if (pass[1] == 3 && !ItemInDungeon(pass[16], pass[4])) {
            msg.message = wonderMailText.ItemNotFound.replace("XX", items[pass[16]]).replace("YY", dungeons[pass[4]])
            return msg
        }
    } else {
        pass[16] = 9
    }
    if (Number(formData.friendAreaReward) !== -1) {
        if (GetDifficulty(pass[1], pass[4], pass[5]) == 0) {
            msg.message = wonderMailText.FriendAreaError
            return msg
        }
        pass[17] = 9
        pass[18] = 9
        pass[19] = Number(formData.friendAreaReward)
    } else
        if (formData.itemReward) {
            pass[17] = formData.itemRewardMoney ? 6 : 8
            pass[18] = formData.itemReward
        } else {
            pass[17] = 5
            pass[18] = 9
        }
    const wonder = datatowonderpass(pass)

    console.log("-------------------wonder----------------", wonder)
    msg.message = formatpass(wonder)
    msg.title = "Wonder Mail Password:"
    return msg

    // if (debug) {
    //     f.data.value = tostr(pass)
    // } else {
    //     f.data.value = maildata(pass)
    // }
}

export const passwordReplacer = (wonderpass: string) => {
    let replacedPass = wonderpass.replace("#", "♂");
    replacedPass = replacedPass.replace("%", "♀");
    replacedPass = replacedPass.replace(".", "…");

    return replacedPass;
};

function maildata(pass: number[]) {
    var ftext = flavorText(pass)
    var h = flavorTextHead(pass, ftext)
    var b = flavorTextBody(pass, ftext)
    b = b.split("<!--break-->")
    var diffstring = "EDCBAS*"
    var data = h + "\r\n  " + b[0].replace(/\s+$/, "")
    if (b.length > 1) {
        data += "\r\n  " + b[1].replace(/\s+$/, "")
    }
    data += "\r\n"
    var poke1 = pass[12] | (pass[13] << 8)
    var poke2 = pass[14] | (pass[15] << 8)
    var item = items[pass[16]]
    data += wonderMailText.ClientLine + " " + pokemon[poke1] + "\r\n"
    data += wonderMailText.ObjectiveLine + " "
    switch (ftext[2]) {
        case 0:
            data += wonderMailText.FriendRescue + "\r\n";
            break
        case 1:
            data += wonderMailText.RescueType3.replace("XXITEM", item) + "\r\n";
            break //Find X
        case 2:
            data += wonderMailText.RescueType4.replace("XXITEM", item) + "\r\n";
            break //Deliver X
        case 3:
            data += wonderMailText.RescueType0 + "\r\n";
            break //Help me
        case 4:
            data += wonderMailText.RescueType1.replace("XXPKMN", pokemon[poke2]) + "\r\n";
            break //Find Pokemon
        case 5:
            data += wonderMailText.RescueType2.replace("XXPKMN", pokemon[poke2]) + "\r\n";
            break //Escort to X
        case 6:
            data += wonderMailText.SpecialMission + "\r\n";
            break
    }
    data += wonderMailText.PlaceLine + " "
    if (ftext[2] == 1) {
        data += wonderMailText.NearPlace.replace("XX", dungeons[pass[4]])
    } else {
        data += dungeons[pass[4]]
    }
    data += " "
    if (IsAboveGround(pass[4]))
        data += wonderMailText.AboveGroundFloor.replace("XX", "" + pass[5])
    else
        data += wonderMailText.BasementFloor.replace("XX", "" + pass[5])
    data += "\r\n"
    var diff = GetDifficulty(pass[1], pass[4], pass[5])
    data += wonderMailText.DifficultyLine + " " + diffstring.charAt(diff) + "\r\n"
    data += wonderMailText.RewardLine + " "
    diff = (diff + 1) * 100
    switch (pass[17]) {
        case 0:
            data += diff + " POKe";
            break
        case 1:
            data += wonderMailText.PlusRewardBrackets.replace("XX", diff + " POKe").replace("YY", items[pass[18]]);
            break
        case 2:
            data += items[pass[18]];
            break
        case 3:
            data += wonderMailText.PlusReward.replace("XX", items[pass[18]]);
            break
        case 4:
            data += "???";
            break
        case 5:
            data += (diff * 2) + " POKe";
            break
        case 6:
            data += wonderMailText.PlusRewardBrackets.replace("XX", (diff * 2) + " POKe").replace("YY", items[pass[18]]);
            break
        case 7:
            data += items[pass[18]];
            break
        case 8:
            data += items[pass[18]] + " + ?";
            break
        case 9:
            data += wonderMailText.PlusReward.replace("XX", items[pass[18]]);
            break
    }
    data += "\r\n"
    data += wonderMailText.WonderMailLine + "\r\n"
    var wonder = datatowonderpass(pass)
    data += formatpass(wonder)
    return data
}

export const setpass = (formData: FormData, pass: number[]) => {
    const headinfo = optionarray(formData.messageTitle)
    const line1 = optionarray(formData.messageBody)
    passSetFlavorText(pass, headinfo[0], headinfo[1], headinfo[2],
        line1[2]);
}

export const plainArrayToOptions = (stringArray: string[]) => stringArray.map((label, value) => ({ label, value }))

export const getPokedexEntry = (options: any[], value: number) => {
    const selectedPokemon = options.find(i => i.value === value)

    if (selectedPokemon) {
        const pokedexEntry = pokedex.find(pokemon => pokemon.name.english.toLocaleLowerCase() === selectedPokemon.label.toLocaleLowerCase())
        if (pokedexEntry) {
            return pokedexEntry
        }

        return {}
    }

    return {}
}

