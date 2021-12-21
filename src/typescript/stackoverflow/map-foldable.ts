import * as assert from "assert"

import { flow, pipe, tuple } from "fp-ts/function"
import * as Mn from "fp-ts/Monoid"
import * as N from "fp-ts/number"
import * as O from "fp-ts/Option"
import * as Ord from "fp-ts/Ord"
import * as RM from "fp-ts/ReadonlyMap"
import * as RT from "fp-ts/ReadonlyTuple"
import * as S from "fp-ts/string"
import * as Sg from "fp-ts/Semigroup"

type Person = string
type Age = number
type PersonAge = readonly [Person, Age]

const ordByAge: Ord.Ord<PersonAge> = pipe(N.Ord, Ord.contramap(RT.snd))

const monoidMaxByAge: Mn.Monoid<O.Option<PersonAge>> = pipe(
  ordByAge,
  Sg.max,
  O.getMonoid
)

const oldestPerson = (ps: ReadonlyMap<Person, Age>) =>
  pipe(
    // RM.foldMapWithIndex(S.Ord)(monoidMaxByAge)(flow(tuple, O.some)),
    RM.getFoldableWithIndex(S.Ord).foldMapWithIndex(monoidMaxByAge)(
      ps,
      flow(tuple, O.some)
    ),
    O.map(RT.fst)
  )

const aliceBob: ReadonlyMap<Person, Age> = new Map([
  ["Alice", 25],
  ["Bob", 25],
])

const bobAlice: ReadonlyMap<Person, Age> = new Map([
  ["Bob", 25],
  ["Alice", 25],
])

const emptyMap: ReadonlyMap<Person, Age> = new Map([])

assert.deepStrictEqual(oldestPerson(aliceBob), oldestPerson(bobAlice))
assert.deepStrictEqual(oldestPerson(emptyMap), O.none)
