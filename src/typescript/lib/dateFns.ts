import * as dateFns from "date-fns/fp"
import { N, RA, RTup, Re } from "./fp-ts-imports"
import * as Strong from "fp-ts/Strong"

const d = new Date("2021-05-16 12:00")
const d_ = new Date(2021, 0, 31)
// const d = new Date()

//
// const now = new Date()
// now
// now.toISOString() //?
// now.toLocaleTimeString() //?

const end = dateFns.addDays(15)(d) //?
const start = dateFns.subDays(15)(d) //?

// const nextMonth =

const XS = [
  [1, 2],
  [0, 1],
  [1, 0],
  [10, 0],
  [10, 2],
]

const YS = [
  [0, 2],
  [0, 0],
  [10, 0],
  [10, 2],
]

const ZS = [
  [0, 2],
  [0, 0],
  [9, 0],
  [10, 1],
  [9, 2],
]

const XS_1 = RA.rotate(-1)(XS) //?
const XS__ = RA.zipWith(XS_1, XS, ([x0, y0], [x1, y1]) => [x1 - x0, y1 - y0])
XS__ ///

const YS_1 = RA.rotate(-1)(YS) //?
const YS__ = RA.zipWith(YS_1, YS, ([x0, y0], [x1, y1]) => [x1 - x0, y1 - y0])
YS__
