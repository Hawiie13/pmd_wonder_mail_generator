import { Difficulties } from "../constant"

export const GetDifficulty = (mission: number, dungeon: number, floor: number) => {
    if (floor <= 0 || dungeon >= Difficulties.length)
        return 0
    floor--
    if (floor >= Difficulties[dungeon].length)
        return 0
    var ret = Difficulties[dungeon][floor]
    if (mission == 2) ret += 2
    ret = Math.min(ret, 15)
    ret = Math.floor(ret / 2)
    ret = Math.min(ret, 6)
    return ret
}