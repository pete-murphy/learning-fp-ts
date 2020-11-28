import { NonEmptyString, UUID } from "io-ts-types"
import * as dateFns from "date-fns"
import { AnyNewtype, Newtype, prism } from "newtype-ts"
import { AnyTuple, Overwrite } from "typelevel-ts"

/**
 * Utility interface used to attach a tag & unique symbol to a Newtype's _URI
 * field.
 *
 * NOTE: We are using the representation
 * `{ _Tag: 'MyTag'; _Symbol: unique symbol }` instead of
 * `{ MyTag: unique symbol }` in order to facilitate easily overwriting the tag
 * when making fresh newtypes. See the `SetTag` utility for more info.
 */
export interface NewtypeURI<Tag extends string> {
  readonly _Tag: Tag
  readonly _Symbol: unique symbol
}

/**
 * Utility interface used to attach "phantom params" to a Newtype's _URI field.
 */
export type PhantomParams<Ps extends AnyTuple> = {
  readonly _PhantomParams: Ps
}

/**
 * A union type representing a valid URI for a SimSpaceNewtype that is also a
 * phantom type.
 */
export type SimSpacePhantomTypeURI = NewtypeURI<string> &
  PhantomParams<AnyTuple>

/**
 * A union type representing a valid type for a SimspaceNewtype's _URI field.
 * This union type is used to allow or disallow constructing a phantom type by
 * either providing or not providing a tuple of PhantomParams" (type parameters
 * that affect the nominal type being constructed but that do not appear on the
 * underlying runtime type).
 */
export type SimSpaceNewtypeURI = NewtypeURI<string> | SimSpacePhantomTypeURI

/**
 * A wrapper around newtype-ts' Newtype interface with exta constraints on the
 * _URI field.
 */
export interface SimSpaceNewtype<URI extends SimSpaceNewtypeURI, RuntimeType>
  extends Newtype<URI, RuntimeType> {}

/**
 * Utility type used to update an existing SimSpaceNewtype's _Tag field.
 * This can be used to provide a new identifier while extending an existing
 * SimSpaceNewtype.
 */
export type SetTag<
  Tag extends string,
  New extends SimSpaceNewtype<SimSpaceNewtypeURI, unknown>
> = New extends SimSpaceNewtype<SimSpacePhantomTypeURI, unknown>
  ? Overwrite<
      New,
      { _URI: NewtypeURI<Tag> & PhantomParams<New["_URI"]["_PhantomParams"]> }
    > // if the newtype is a phantom type, also persist its "phantom params"
  : { _URI: NewtypeURI<Tag> } // otherwise, only replace the _URI field

/**
 * A generic phantom type. `A` represents the underlying runtime type being
 * wrapped, and `B` represents an extra "phantom param" used to tag the nominal
 * type with extra information.
 *
 * Modeled after Haskell's `Const` from `Control.Applicative` and
 * `Data.Functor.Const`.
 *
 * NOTE: `fp-ts` already has a `Const` data type and module, which does not use
 * newtype-ts. Be careful to avoid collisions.
 */
export interface Const<A, B>
  extends SimSpaceNewtype<NewtypeURI<"Const"> & PhantomParams<[B]>, A> {}

/**
 * A specialized verson of the `Const` phantom type with its type params
 * flipped and the "phantom param" being constrained to a type-level literal
 * string.
 *
 * Modeled after Haskell's `Tagged` from `Data.Tagged`.
 *
 * NOTE: `io-ts` already has a `Tagged` type, but it is deprecated. Be careful
 * to avoid collisions.
 */
export interface Tagged<S extends string, B>
  extends SetTag<"Tagged", Const<B, S>> {}

/**
 * A specialized verson of the `Const` phantom type where the underlying
 * runtime type is fixed to type `string`. This is a useful phantom type for
 * providing extra safety by disambiguating between string IDs for different
 * types.
 *
 * Modeled after the `Key` phantom type in our Haskell codebase.
 *
 * Note: Some of the generated TypeScript type files already have a
 * `type Key = string` type alias. Be Careful to avoid collisions.
 */
export interface Key<A> extends SetTag<"Key", Const<string, A>> {}

/**
 * A phantom type just like `Key` but the underlying type is an io-ts-types UUID
 * instead of a string.
 */
export interface UUIDKey<A> extends SetTag<"UUIDKey", Const<UUID, A>> {}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/**
 * Gets a prism that validates UUIDs.
 *
 * NOTE: You may not need this if using io-ts Codecs.
 */
export function getPrismUUID<A>() {
  return prism<UUIDKey<A>>(uuidRegex.test)
}

/**
 * A phantom type wrapper for expresing versions which are a part of
 * versioned entities.
 *
 * Modeled after the `Version` phantom type in our Haskell codebase.
 *
 * Note: Some of the generated TypeScript type files already have a
 * `type Version = number` type alias. Be Careful to avoid collisions.
 */
export interface Version<A> extends SetTag<"Version", Const<number, A>> {}

/**
 * A specialized verson of the `Const` phantom type where the underlying
 * runtime type is fixed to type `string`. This is a useful phantom type for
 * providing extra safety by disambiguating between names for different types.
 */
export interface Name<A> extends SetTag<"Name", Const<string, A>> {}

/**
 * A phantom type just like `Name` but the underlying type is an io-ts-types
 * NonEmptyString instead of a string.
 */
export interface NonEmptyName<A>
  extends SetTag<"NonEmptyName", Const<NonEmptyString, A>> {}

/**
 * A specialized verson of the `Const` phantom type where the underlying
 * runtime type is fixed to type `string`. This is a useful phantom type for
 * providing extra safety by disambiguating between descriptions for different
 * types.
 */
export interface Description<A>
  extends SetTag<"Description", Const<string, A>> {}

/**
 * NaN is a refinement of number
 */
export interface NaN extends SimSpaceNewtype<NewtypeURI<"NaN">, number> {}

/**
 * Use this prism to return an option with prismNaN.getOption(someNumber)
 */
export const prismNaN = prism<NaN>(Number.isNaN)

/**
 * Infinity is a refinement of number
 */
export interface Infinity
  extends SimSpaceNewtype<NewtypeURI<"Infinity">, number> {}

export const prismInfinity = prism<Infinity>(
  x => !Number.isFinite(x) && !Number.isNaN(x)
)

/**
 * Finite is a refinement of number
 */
export interface Finite extends SimSpaceNewtype<NewtypeURI<"Finite">, number> {}

export const prismFinite = prism<Finite>(Number.isFinite)

/*
 * IsoDate is a refinement of string
 */
export interface IsoDate
  extends SimSpaceNewtype<NewtypeURI<"IsoDate">, string> {}

/*
 * A prism giving you a `getOption` function that returns a `Some<IsoDate>`
 * if the run-time string can is a valid ISO date string or a `None` if it
 * isn't.
 */
export const prismIsoDate = prism<IsoDate>(str => {
  const parsedDate = dateFns.parseISO(str)
  return dateFns.isValid(parsedDate)
})

/*
 * Coerce any Newtype to its underlying runtime type.
 *
 * NOTE: This coercion is 100% safe and does not require explicitly providing
 * the generic type param for the Newtype.
 */
export type CoerceNewtype<N extends AnyNewtype> = N extends Newtype<
  unknown,
  infer A
>
  ? A
  : never

/*
 * Coerce any Newtype to its underlying runtime type.
 *
 * NOTE: This coercion is 100% safe and does not require explicitly providing
 * the generic type param for the Newtype.
 */
export const coerce = <N extends AnyNewtype>(n: N): CoerceNewtype<N> =>
  n as CoerceNewtype<N>

/*
 * Coerce any type-level string literal or Newtype over string to its underlying
 * string run-time type.
 *
 * NOTE: This coercion is 100% safe and does not require explicitly providing
 * the generic type param for the type-level string literal or Newtype.
 */
export const coerceToString = <S extends string | Newtype<unknown, string>>(
  s: S
): string => s as string
