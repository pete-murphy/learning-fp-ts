import { array, traverse } from "fp-ts/lib/Array"
import { flow, pipe } from "fp-ts/lib/function"
import { monoidSum } from "fp-ts/lib/Monoid"
import * as L from "monocle-ts/lib/Lens"
import * as O from "monocle-ts/lib/Optional"
import * as T from "monocle-ts/lib/Traversal"
import * as I from "monocle-ts/lib/Ix"
import { Applicative } from "fp-ts/lib/Applicative"
import { HKT } from "fp-ts/lib/HKT"
import { RA, Str } from "../ssstuff/fp-ts-imports"
import { match, matchS } from "../ssstuff/matchers.ignore"

const ex1 = [
  [0, 1, 2],
  [3, 4],
  [5, 6, 7, 8],
]

// Write a traversal that focuses the 6th element of nested list
// In Haskell it would be `elementOf (traversed . traversed)`

const t = pipe(
  L.id<Array<Array<number>>>(),
  L.traverse(array),
  T.index(4)
  // T.traverse(array)
)

// pipe(
//   t,
//   T.(x => x * 100)
// )(ex) //?

// -- Add "Rich " to the names of people with more than $1000
// >>> (("Ritchie", 100000), ("Archie", 32), ("Reggie", 4350))
//       & each
//       . filtered ((> 1000) . snd)
//       . _1
//       %~ ("Rich " ++)
// (("Rich Ritchie", 100000), ("Archie", 32), ("Rich Reggie", 4350))

type Person = {
  name: string
  money: number
}

const ex2: ReadonlyArray<Person> = [
  { name: "Ritchie", money: 100_000 },
  { name: "Archie", money: 32 },
  { name: "Reggie", money: 4350 },
]

const t2_ = pipe(
  T.id<ReadonlyArray<Person>>(),
  // T.traverse(RA.Traversable),
  // T.filter(),
  // T.(person => person.money > 1000),
  T.findFirst(person => person.money > 1000),
  T.prop("name"),
  // T.modify(name => `Rich ${name}`),
  // T.foldMap(RA.getMonoid())
  T.fold(Str.Monoid)
)(ex2) //?

const t3_ = pipe(
  ex2,
  pipe(
    T.id<ReadonlyArray<Person>>(),
    // T.filter(),
    // T.(person => person.money > 1000),
    // T.findFirst(person => person.money > 1000),
    T.traverse(RA.Traversable),
    T.prop("name"),
    // T.modify(name => `Rich ${name}`),
    // T.foldMap(RA.getMonoid())
    T.fold(Str.Monoid)
  )
) //?

const t2 = pipe(
  L.id<Array<Person>>(),
  L.traverse(array),
  T.filter(x => x.money > 1000),

  T.modify(
    pipe(
      L.id<Person>(),
      L.prop("name"),
      L.modify(name => `Rich ${name}`)
    )
  )
)

// t2(ex2) //?

const worded: T.Traversal<string, string> = {
  modifyF:
    <F>(F: Applicative<F>) =>
    (f: (str: string) => HKT<F, string>) =>
      flow(
        (str: string) => str.split(/\s+/),
        traverse(F)(f),
        fa => F.map(fa, ws => ws.join(" "))
      ),
}

const arrayTraversal = <A>(): T.Traversal<Array<A>, A> => ({
  modifyF:
    <F>(F: Applicative<F>) =>
    (f: (a: A) => HKT<F, A>) =>
      traverse(F)(f),
})

const uppercaseWordsStartingWithFOrA = pipe(
  worded,
  T.filter(w => w.startsWith("f") || w.startsWith("a")),
  T.filter(w => w.length > 2),
  T.modify(s => s.toLocaleUpperCase())
)

uppercaseWordsStartingWithFOrA(
  "See what happens when you find a stranger in the alps?"
) //?

// <F>(F: Applicative<F>): (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>
