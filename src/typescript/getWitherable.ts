import { flow, pipe } from "fp-ts/lib/function"
import * as RM from "fp-ts/lib/ReadonlyMap"
import * as O from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Show from "fp-ts/lib/Show"

export const fromStringMap = <K extends string, A>(
  m: ReadonlyMap<K, A>
): RR.ReadonlyRecord<K, A> => {
  const r: Record<string, A> = {}
  for (const [k, v] of m) {
    r[k] = v
  }
  return (r as unknown) as RR.ReadonlyRecord<K, A>
}

const m1: ReadonlyMap<string, O.Option<number>> = new Map()
const m2: ReadonlyMap<string, O.Option<number>> = new Map([["a", O.some(1)]])
const m3: ReadonlyMap<string, O.Option<number>> = new Map([
  ["a", O.some(1)],
  ["b", O.some(2)],
])
const m4: ReadonlyMap<string, O.Option<number>> = new Map([["a", O.none]])
const m5: ReadonlyMap<string, O.Option<number>> = new Map([
  ["a", O.none],
  ["b", O.some(1)],
])

const s = flow(
  RM.getWitherable(Ord.ordString).sequence(O.Applicative),
  O.map(fromStringMap)
  // O.getShow(Show.showNumber).show
)

s(m1) //?
s(m2) //?
s(m3) //?
s(m4) //?
s(m5) //?
