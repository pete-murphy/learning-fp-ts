import { Eq, eqBoolean, eqNumber, eqString } from "fp-ts/lib/Eq"
import { pipe } from "fp-ts/lib/pipeable"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RR from "fp-ts/lib/ReadonlyRecord"

export const diffRows = <
  Rec extends RR.ReadonlyRecord<string, any>,
  K extends keyof Rec
>(
  eqs: { [K_ in keyof Rec]: Eq<Rec[K_]> }
) => (x: Rec) => (y: Rec): ReadonlyArray<[K, Rec[K]]> =>
  pipe(
    x,
    RR.keys,
    RA.chain(k => (eqs[k].equals(x[k], y[k]) ? [] : [k, y[k]]))
  )

const prev = { foo: "hey", bar: 1, baz: true }
const next = { foo: "hello", bar: 1, baz: true }

diffRows({ foo: eqString, bar: eqNumber, baz: eqBoolean })(prev)(next) //?
