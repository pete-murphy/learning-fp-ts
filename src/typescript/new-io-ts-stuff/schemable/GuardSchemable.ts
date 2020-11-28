import { Int } from "io-ts"
import { date, NonEmptyString, UUID } from "io-ts-types"
import { Decoder } from "io-ts/lib/Decoder"
import * as G from "io-ts/lib/Guard"
import { None, none, Option, Some } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import { isRight } from "fp-ts/lib/These"

import { isNotNil, isNull, isObject } from "./monorail/guards"

import { AppSchemable1 } from "./AppSchemable"

export const NoneGuard: G.Guard<unknown, None> = {
  is: (u: unknown): u is None => isObject(u) && u === none,
}

export const SomeGuard = <A>(
  value: G.Guard<unknown, A>
): G.Guard<unknown, Some<A>> => ({
  is: (u: unknown): u is Some<A> =>
    isObject(u) &&
    (u as Some<A>)._tag === "Some" &&
    isNotNil((u as Some<A>).value) &&
    value.is((u as Some<A>).value),
})

export const fromDecoder = <A, B extends A>(
  decoder: Decoder<A, B>
): G.Guard<A, B> => ({
  is: (a): a is B => isRight(decoder.decode(a)),
})

export const GuardSchemable: AppSchemable1<G.URI> = {
  ...G.Schemable,
  ...G.WithRefine,
  ...G.WithUnion,
  ...G.WithUnknownContainers,
  nonEmptyString: pipe(
    G.string,
    G.refine((u): u is NonEmptyString => u.length > 0)
  ),
  date,
  int: Int,
  uuid: UUID,
  newtype: (from, _iso) => from,
  unknown: { is: (u): u is unknown => true },
  option: <A>(value: G.Guard<unknown, A>) =>
    G.union(NoneGuard, SomeGuard(value)),
  optionFromNullable: <A>(from: G.Guard<unknown, A>) => ({
    is: (u): u is Option<A> => isNull(u) || from.is(u),
  }),
  set: <A>(value: G.Guard<unknown, A>) => {
    const array = G.array(value)

    return {
      is: (u): u is ReadonlySet<A> =>
        u instanceof Set && array.is(Array.from(u.values())),
    }
  },
}
