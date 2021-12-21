import { Comonad1 } from "fp-ts/lib/Comonad"
import { flow, identity, pipe } from "fp-ts/lib/function"
import { Kind, URIS } from "fp-ts/lib/HKT"
import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Pred from "fp-ts/lib/Predicate"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Str from "fp-ts/lib/string"
import * as Struct from "fp-ts/lib/struct"

type T = {
  foo: number
}

type U = {
  a: T[]
  b: T[]
  c: T[]
}

declare const ts: ReadonlyArray<T>

// const S = Struct.

// export const output: Output = RR.fromFoldableMap(RA.getSemigroup<T>(), RA.Foldable)(
//   ts,
//   t => [t.foo < 0 ? "a" as const : t.foo === 0 ? "b" as const : "c" as const, [t]]
// )
