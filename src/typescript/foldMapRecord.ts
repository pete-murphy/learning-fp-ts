import { pipe } from "fp-ts/lib/pipeable"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Sg from "fp-ts/lib/Semigroup"

const things: ReadonlyArray<{ foo: number }> = [
  { foo: 1 },
  { foo: 21 },
  { foo: 2 },
  { foo: 9 },
]

const isOdd: (n: number) => boolean = n => Math.abs(n % 2) === 1

const M = RR.getMonoid<string, { foo: number }>(Sg.getFirstSemigroup())

pipe(
  things,
  RA.foldMap(M)(thing => (isOdd(thing.foo) ? { [thing.foo]: thing } : M.empty))
) //?
