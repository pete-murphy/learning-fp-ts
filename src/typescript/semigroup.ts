import { getMeetSemigroup, getJoinSemigroup } from "fp-ts/lib/Semigroup"
import { ordString, ordNumber, max, min } from "fp-ts/lib/Ord"
import { getOrd } from "fp-ts/lib/Array"

const xs = [1, 2, 4, 5]
const ys = [9, 8]
getMeetSemigroup(getOrd(ordNumber)).concat(xs, ys) //?
getJoinSemigroup(getOrd(ordNumber)).concat(xs, ys) //?

max(getOrd(ordNumber))(xs, ys) //?
min(getOrd(ordNumber))(xs, ys) //?
