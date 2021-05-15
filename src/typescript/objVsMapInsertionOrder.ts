import * as RR from "fp-ts/lib/ReadonlyRecord"

const r1 = {}
const r2 = RR.insertAt("b", 2)(r1)
const r3 = RR.insertAt("a", 1)(r2)
r3
