export * from "monocle-ts/Traversal"

import * as T from "monocle-ts/Traversal"
import * as L from "monocle-ts/Lens"
import * as RA from "fp-ts/ReadonlyArray"
import * as Mn from "fp-ts/Monoid"
import * as Fn from "fp-ts/function"
import * as Id from "fp-ts/Identity"

const pipe = Fn.pipe

export const partsOf = <S, A>(
  t: T.Traversal<S, A>
): L.Lens<S, ReadonlyArray<A>> => ({
  get: x => pipe(t, T.getAll(x)),
  set: RA.foldMap(Fn.getEndomorphismMonoid<S>())(a => pipe(t, T.set(a))),
})

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

pipe(
  T.id<ReadonlyArray<Group>>(),
  T.traverse(RA.Traversable),
  T.prop("users"),
  T.traverse(RA.Traversable),
  T.prop("name"),
  partsOf
).set(newNames)(exampleGroups) //?
