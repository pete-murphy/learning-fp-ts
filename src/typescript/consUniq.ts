import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"
import { Eq, contramap, eqNumber } from "fp-ts/lib/Eq"

/**
 * This is close to `cons` for ordered sets. If there is an element `a'` in `as`
 * that is equal to `a` according to the `Eq<A>` instance passed in, then we
 * "replace" `a'` with `a`, otherwise we add `a` to the head of `as`.
 */
export const consUniq = <A>(eq: Eq<A>) => (a: A) => (
  as: ReadonlyArray<A>
): ReadonlyArray<A> =>
  pipe(
    as,
    A.spanLeft(x => !eq.equals(a, x)),
    ({ init, rest }) =>
      A.isEmpty(rest)
        ? A.cons(a, init)
        : A.getMonoid<A>().concat(init, [a, ...rest.slice(1)])
  )

type User = {
  name: string
  id: number
}

const eqUser: Eq<User> = contramap((user: User) => user.id)(eqNumber)

const users = [
  { name: "Alice", id: 1 },
  { name: "Bob", id: 2 },
  { name: "Carol", id: 3 },
]

consUniq(eqUser)({ name: "David", id: 2 })(users) //?
consUniq(eqUser)({ name: "David", id: 4 })(users) //?
