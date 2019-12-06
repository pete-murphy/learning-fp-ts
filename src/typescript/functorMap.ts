import * as M from "fp-ts/lib/Map"
import { eqNumber } from "fp-ts/lib/Eq"
import { getMonoid, array, getShow } from "fp-ts/lib/Array"
import { showNumber, showString } from "fp-ts/lib/Show"

const pairs: Array<[number, Array<string>]> = [
  [0, ["a"]],
  [0, ["b"]],
  [1, ["c"]],
]
const m = M.fromFoldable(eqNumber, getMonoid<string>(), array)(pairs) //?

const showMyMap = M.getShow(showNumber, getShow(showString)) //?

const m2 = M.map((strs: Array<string>) => strs.map(s => s.toUpperCase()))(m) //?

showMyMap.show(m2) //?
