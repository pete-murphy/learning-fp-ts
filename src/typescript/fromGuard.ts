import * as E from "fp-ts/lib/Either"
import { not, pipe } from "fp-ts/lib/function"

type Foo = {
  foo: number
}

type Bar = {
  bar: number
}

const fooGuard = (x: Foo | Bar): x is Foo => "foo" in x

const isNumber = (x: unknown): x is number => typeof x === "number"

export const fromGuard = <A, B extends A>(
  refinement: (a: unknown) => a is B
) => (a: A): E.Either<Exclude<A, B>, B> =>
  refinement(a) ? E.right(a) : E.left(a as Exclude<A, B>)

declare const foo: number | string
pipe(foo, fromGuard(isNumber), x => x)

// const ex = (x: Foo | Bar) =>
//   pipe(
//     x,
//     E.fromPredicate(fooGuard, () => x),
//     z => _
//   )
