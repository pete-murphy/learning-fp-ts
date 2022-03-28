export * from "monocle-ts/Traversal"

import * as T from "monocle-ts/Traversal"
import * as L from "monocle-ts/Lens"
import * as RA from "fp-ts/ReadonlyArray"
import * as Mn from "fp-ts/Monoid"
import * as Fn from "fp-ts/function"
import * as Id from "fp-ts/Identity"
import { Applicative } from "fp-ts/lib/Applicative"
import { HKT } from "fp-ts/lib/HKT"

const pipe = Fn.pipe

// export const partsOf = <S, A>(
//   t: T.Traversal<S, A>
// ): L.Lens<S, ReadonlyArray<A>> => ({
//   get: x => pipe(t, T.getAll(x)),
//   set: RA.foldMap(Fn.getEndomorphismMonoid<S>())(a => pipe(t, T.set(a))),
// })

//////////////////////////////////////////////////
//////////////////////////////////////////////////

type User = {
  readonly key: string
  readonly name: string
}

type Group = {
  readonly key: string
  readonly users: ReadonlyArray<User>
}

const exampleGroups: ReadonlyArray<Group> = [
  {
    key: "foo",
    users: [
      {
        key: "1",
        name: "Carol",
      },
      {
        key: "2",
        name: "Bob",
      },
    ],
  },
  {
    key: "bar",
    users: [
      {
        key: "1",
        name: "Dave",
      },
      {
        key: "2",
        name: "Eve",
      },
    ],
  },
]

const newNames: ReadonlyArray<string> = ["Yvette", "Jonathan"]

const getIndexed = <A>(): T.Traversal<
  ReadonlyArray<A>,
  readonly [number, A]
> => ({
  modifyF:
    <F>(F: Applicative<F>) =>
    (f: (p: readonly [number, A]) => HKT<F, readonly [number, A]>) =>
    (as: ReadonlyArray<A>) =>
      Fn.pipe(
        as,
        RA.mapWithIndex((i, a: A) => Fn.tuple(i, a)),
        RA.traverse(F)(f),
        fa =>
          F.map(
            fa,
            RA.map(([_, a]) => a)
          )
      ),
})

export const partsOf = <S, A>(
  t: T.Traversal<S, A>
): L.Lens<S, ReadonlyArray<A>> => ({
  get: x => pipe(t, T.getAll(x)),
  // set: xs => (RA.foldMap(Fn.getEndomorphismMonoid<S>())((s: S) => pipe(t, T.getAll, getIndexed<A>(s), T.modify(([i,z]) => a))))(xs),
  // set: x => x
  set:
    (a: ReadonlyArray<A>) =>
    (s: S): S =>
      pipe(t, getIndexed<A>()),
})

pipe(
  T.id<ReadonlyArray<Group>>(),
  T.traverse(RA.Traversable),
  T.prop("users"),
  T.traverse(RA.Traversable),
  T.prop("name"),
  partsOf
).set(newNames)(exampleGroups) //?
