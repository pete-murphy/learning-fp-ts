import * as t from "io-ts"
import { atRecord } from "monocle-ts/lib/At/Record"
import { Lens, Prism, fromTraversable } from "monocle-ts"
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import { identity } from "fp-ts/lib/function"

const Foo = t.type({
  foo: t.number,
  bar: t.string,
  x: t.never,
})

Foo.validate({ foo: 1, bar: "" }, []) //?
Foo.validate({ foo: 1, bar: "", x: 1 }, []) //?

const ExactFoo = t.exact(Foo)

ExactFoo.validate({ foo: 1, bar: "", x: 1 }, []) //?

const UserName = t.type({
  name: t.string,
})

const UserIsActive = t.partial({
  isActive: t.boolean,
})

const User = t.intersection([UserName, UserIsActive])

type User = t.TypeOf<typeof User>

User.decode({
  name: "Foo",
}) //?

// const prism = new Prism<E.Either<Error, User>, User>(
//   O.fromEither,
//   E.right
// ).composeLens(Lens.fromNullableProp<User>()("isActive", false))

const traversal = fromTraversable(E.either)<t.Errors, User>().composeLens(
  Lens.fromNullableProp<User>()("isActive", false)
)

traversal.modify(identity)(
  User.decode({
    name: "Foo",
  })
)
