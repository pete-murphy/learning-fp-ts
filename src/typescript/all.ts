import * as _ from "lodash/fp"
import * as R from "ramda"

const all = (...bools: Array<boolean>): boolean => bools.every(x => x)
const any = (...bools: Array<boolean>): boolean => bools.some(x => x)

all(true, false) //?
any(true, false) //?

_.allPass(Boolean)(true, false) //?

R.reduce(R.and)(true, R.__) //?