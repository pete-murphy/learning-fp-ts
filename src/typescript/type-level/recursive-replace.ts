import * as G from "io-ts/lib/Guard"
import * as t from "io-ts"
import * as R from "fp-ts/Record"
import { pipe } from "fp-ts/lib/function"
import { O } from "../ssstuff/fp-ts-imports"
import { isNotNil, isObject } from "../ssstuff/typeGuards"

export const NoneGuard: G.Guard<unknown, O.None> = {
  is: (u: unknown): u is O.None => isObject(u) && u === O.none,
}

export const SomeGuard = <A>(
  value: G.Guard<unknown, A>
): G.Guard<unknown, O.Some<A>> => ({
  is: (u: unknown): u is O.Some<A> =>
    isObject(u) &&
    (u as O.Some<A>)._tag === "Some" &&
    isNotNil((u as O.Some<A>).value) &&
    value.is((u as O.Some<A>).value),
})

// https://www.reddit.com/r/typescript/comments/hr19a2/cool_helper_type_that_will_allow_you_to/
type Primitive = string | number | bigint | boolean | null | undefined

type Coerce<S, A, B> = S extends A | Primitive
  ? S extends A
    ? B | Exclude<S, A>
    : S
  : {
      [K in keyof S]: Coerce<S[K], A, B>
    }

const optionGuard = G.union(NoneGuard, SomeGuard(G.id()))

const coerce = <S>(s: S) =>
  optionGuard.is(s) ? fn(s) : t.UnknownRecord.is(s) ? pipe(s, R.map(coerce)) : s

// const coerce =
//   <A, B>(fn: (a: A) => B, guard: Guard<unknown, A>) =>
//   <S>(s: S) =>
//     guard.is(s)
//       ? fn(s)
//       : t.UnknownRecord.is(s)
//       ? pipe(s, R.map(coerce(fn, guard)))
//       : s

// coerce(O.toNullable, )({})

// type Foo = symbol
// type Bar = "3"

type ToReplace =
  | {
      x?: {
        y: Foo | number
        z: string
      }[]
    }
  | undefined

type WasReplaced = Coerce<ToReplace, Foo, Bar>
/* Output:
{
    x?: {
        y: number | "3";
        z: string;
    }[];
}
*/

export {}
