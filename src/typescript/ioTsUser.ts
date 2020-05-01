import * as t from "io-ts"
import { Lens, fromTraversable } from "monocle-ts"
import { either } from "fp-ts/lib/Either"
import { identity } from "fp-ts/lib/function"
import { pipe } from "fp-ts/lib/pipeable"

const UserName = t.type({
  name: t.string,
})

const UserIsActive = t.partial({
  isActive: t.boolean,
})

const User = t.intersection([UserName, UserIsActive])

type User = t.TypeOf<typeof User>

const isActiveLens = Lens.fromNullableProp<User>()("isActive", false)
const traversal = fromTraversable(either)<t.Errors, User>().composeLens(
  isActiveLens
)

const users = [
  { name: "Alice", isActive: false },
  { name: "Bob", isActive: true },
  { name: "Carol" },
]

users.map(user => pipe(user, User.decode, traversal.modify(identity))) //?
/*
 [ { _tag: 'Right', right: { name: 'Alice', isActive: false } },
   { _tag: 'Right', right: { name: 'Bob', isActive: true } },
   { _tag: 'Right', right: { name: 'Carol', isActive: false } } ]
*/
// users.map(user => pipe(user, User.decode, isActiveTraversal.modify(identity))) //?

traversal.modify(identity)(
  User.decode({
    name: "Foo",
  })
) //?
