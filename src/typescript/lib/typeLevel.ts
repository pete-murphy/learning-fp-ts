import { ReactElement } from "react"
import { Either } from "fp-ts/lib/Either"
import { HKT, HKT2, HKT3, HKT4, URIS, URIS2, URIS3, URIS4 } from "fp-ts/lib/HKT"
import { Option } from "fp-ts/lib/Option"

import { NaN } from "./newtypes"

/**
 * Type representing possible TypeScript primitive types
 */
export type Primitive = string | number | boolean | undefined | null | void | {}

/**
 * Type representing possible TypeScript primitive types we consider safe
 */
export type SafePrimitive = string | number | boolean | object

/**
 * Type representing all possible falsy values, uses a newtype
 * to represent NaN
 */
export type Falsy = null | undefined | false | "" | 0 | NaN

/**
 * Type representing all truthy values
 */
export type Truthy<T> = T extends Falsy ? never : T

/**
 * Type-level utils to extract types from HKTs
 */

export type HKT1S<A = unknown> = HKT<URIS, A>

export type HKT2S<L = unknown, A = unknown> = HKT2<URIS2, L, A>

export type HKT3S<U = unknown, L = unknown, A = unknown> = HKT3<URIS3, U, L, A>

export type HKT4S<X = unknown, U = unknown, L = unknown, A = unknown> = HKT4<
  URIS4,
  X,
  U,
  L,
  A
>

export type HKTS = HKT1S | HKT2S | HKT3S | HKT4S

export type ExtractFromHKT1<F> = F extends HKT1S<infer A> ? A : never

export type ExtractFromHKT2<F> = F extends HKT2S<infer L, infer A>
  ? [L, A]
  : never

export type ExtractFromHKT3<F> = F extends HKT3S<infer U, infer L, infer A>
  ? [U, L, A]
  : never

export type ExtractFromHKT4<F> = F extends HKT4S<
  infer X,
  infer U,
  infer L,
  infer A
>
  ? [X, U, L, A]
  : never

export type ExtractFromHKTS<F extends HKTS> = F extends HKT1S
  ? ExtractFromHKT1<F>
  : F extends HKT2S
  ? ExtractFromHKT2<F>
  : F extends HKT3S
  ? ExtractFromHKT3<F>
  : F extends HKT4S
  ? ExtractFromHKT4<F>
  : never

export type ExtractAFromHKT<F extends HKT1S> = ExtractFromHKT1<F>

export type ExtractLFromHKT2<F extends HKT2S> = ExtractFromHKT2<F>["0"]
export type ExtractAFromHKT2<F extends HKT2S> = ExtractFromHKT2<F>["1"]

export type ExtractUFromHKT3<F extends HKT3S> = ExtractFromHKT3<F>["0"]
export type ExtractLFromHKT3<F extends HKT3S> = ExtractFromHKT3<F>["1"]
export type ExtractAFromHKT3<F extends HKT3S> = ExtractFromHKT3<F>["2"]

export type ExtractXFromHKT4<F extends HKT4S> = ExtractFromHKT4<F>["0"]
export type ExtractUFromHKT4<F extends HKT4S> = ExtractFromHKT4<F>["1"]
export type ExtractLFromHKT4<F extends HKT4S> = ExtractFromHKT4<F>["2"]
export type ExtractAFromHKT4<F extends HKT4S> = ExtractFromHKT4<F>["3"]

/**
 * Type-level util to extract the type A in Option<A>
 */
export type ExtractAFromOption<O> = O extends Option<infer U> ? U : never

/**
 * Type-level util to extract the type T in Array<T>
 */

export type ExtractTFromArray<A> = A extends Array<infer U> ? U : never

/**
 * Type-level utils to extract the types L and A in Either<L, A>
 */

export type ExtractLFromEither<E> = E extends Either<infer U, unknown>
  ? U
  : never
export type ExtractAFromEither<E> = E extends Either<unknown, infer U>
  ? U
  : never

/**
 * Generic nullable type for unions with `null`
 */
export type Nullable<A> = A | null

/**
 * Generic undefinedable type for unions with `undefined`
 */
export type Undefinedable<A> = A | undefined

/**
 * A type representing either null or undefined
 */
export type Nil = null | undefined

/**
 * Generic nillable type for unions with Nil (`null` and `undefined`)
 */
export type Nilable<A> = A | Nil

/**
 * Equivalent to TypeScript's built-in NonNullable, but with consistent naming
 */
export type NonNilable<T> = T extends Nil ? never : T

/**
 * A reusable, flexible conditional type utlity which let's you express a
 * conditional return type based on whether or not generic `A` is a subtype of
 * generic `B` in a concise way
 */
export type IfIsThenElse<A, B, Then, Else> = [A] extends [B] ? Then : Else

/**
 * A partially applied version of IfIsThenElse where generic `B` is `never`
 */
export type IfIsNeverThenElse<A, Then, Else> = IfIsThenElse<
  A,
  never,
  Then,
  Else
>

/**
 * Like TypeScript's native Required, but also disallows null
 * (All props must be defined & non-null)
 */
export type RequireNonNilable<A> = { [P in keyof A]-?: NonNilable<A[P]> }

/**
 * Map over `Record` property values and unbox those of type `Option<A>` to type `A`
 */
export type UnboxRecordPropertyOptionValues<
  R extends Record<PropertyKey, unknown>
> = { [K in keyof R]: R[K] extends Option<infer A> ? A : R[K] }

/**
 * Alias of ReactElement | null, similar to ReactNode, but compatible with FunctionComponent
 */
export type ReactRenderable = Nullable<ReactElement>

/**
 * Gets a union of all the value types associated with an obj type (interface, Record, etc.)
 */
export type ObjectValues<A extends object> = A[keyof A]

/**
 * Extracts the union of the types of values contained in any native JS collection,
 * including:
 * - Record
 * - Array
 * - Map
 * - WeakMap
 * - Set
 * - WeakSet
 */
export type Values<T extends object> = T extends Record<
  string | number | symbol,
  infer A
>
  ? A
  : T extends Array<infer B>
  ? B
  : T extends Map<unknown, infer C>
  ? C
  : T extends WeakMap<object, infer D>
  ? D
  : T extends Set<infer E>
  ? E
  : T extends WeakSet<infer F>
  ? F
  : unknown

/**
 * A version of `keyof` that distributes over union types
 *
 * Example:
 *
 * type Person =
 * | { name: string }
 * | { age: number}
 *
 * type Keys = DistributiveKeyOf<Person> // 'name' | 'age'
 */
export type DistributiveKeyOf<T extends object> = T extends unknown
  ? keyof T
  : never

/**
 * Applies an optional type of never for keys that exist on the distributive type but not in
 * the union type
 *
 * This is so that you don't have to explicitly add the type, but even if you do
 * it will error because it is of type never (unless you cast as never)
 *
 * Behaves in a similar way to Exact from typelevel-ts but on unions and not records
 *
 * Example:
 *
 * type Person =
 * | { name: string }
 * | { age: number }
 *
 * type Keys = DistributiveExact<Person, Person> //
 * ({
 *   name: string;
 * } & Partial<Record<"age", never>>) | ({
 *  age: number;
 * } & Partial<Record<"name", never>>)
 */
export type DistributiveExact<A extends object, B extends A> = A extends unknown
  ? A &
      Partial<
        Record<Exclude<DistributiveKeyOf<B>, DistributiveKeyOf<A>>, never>
      >
  : never

/**
 * Given a union of objects it will enforce that only one is used. Does the
 * same thing as DistributiveExact so it's just additional helper. Should *likely*
 * only be used on React components in order to specify the props it should accept.
 * For other data types a ADT should be used instead, i.e. { tag: 'label', etc...}.
 *
 * Example:
 * type Person =
 *   | { name: string }
 *   | { age: number}
 *
 * const person: ExactRecordsUnion<Person> = {
 *   name: 'Adam"
 * } // works!
 *
 * const person: ExactRecordsUnion<Person> = {
 *   name: 'Adam'
 *   age: 33,
 * } // errors!
 *
 * Taken and modified from: https://stackoverflow.com/questions/52677576/typescript-discriminated-union-allows-invalid-state/52678379#52678379
 */
export type ExactRecordsUnion<A extends object> = DistributiveExact<A, A>

/**
 * Select the member of a union type by matching on the the provided key, `K`,
 * and value, `V`. Returns `never` if no match occurs.
 */
export type SelectUnionMember<
  K extends PropertyKey,
  T,
  U extends object
> = U extends {
  [P in K]: T
} &
  infer A
  ? unknown extends A
    ? U
    : A
  : never

/**
 * A specialization of `SelectUnionMember`, matching on the `tag` field with
 * a given type-level string literal, `T`. Returns `never` if no match occurs.
 */
export type SelectUnionMemberByTag<
  T extends string,
  U extends object
> = SelectUnionMember<"tag", T, U>

/**
 * A specialization of `SelectUnionMember`, matching on the `contents` field
 * with a given value, `C`. Returns `never` if no match occurs.
 */
export type SelectUnionMemberByContents<
  C,
  U extends object
> = SelectUnionMember<"contents", C, U>

/**
 * A version of `Pick` that distributes over union types.
 */
export type DistributivePick<
  U extends object,
  K extends DistributiveKeyOf<U>
> = {
  [P in K]: unknown extends U[P]
    ? {
        // This can just be `[P2 in P]: SelectUnionMember<P2, unknown, U>[P2]`,
        // without the conditional type check, in newer versions of TS.
        [P2 in P]: P2 extends keyof SelectUnionMember<P2, unknown, U>
          ? SelectUnionMember<P2, unknown, U>[P2]
          : never
      }[P]
    : { [P2 in P]: U[P2] }[P]
}

/**
 * A version of `Omit` that distributes over union types.
 */
export type DistributiveOmit<
  U extends object,
  K extends DistributiveKeyOf<U>
> = DistributivePick<U, Exclude<DistributiveKeyOf<U>, K>>

export type ExtractMemberFromUnion<
  A extends object,
  B extends ExactRecordsUnion<A>
> = B

/**
 * Check if a type is never.
 */
export type IsNever<A> = [A] extends [never] ? true : false

/**
 * Extracts a union of key-name/value-type pairs from an object type
 *
 * @example
 * type Foo = { bar: number, baz: string, zot: boolean }
 * type Quux = ExtractKeyValuePairs<Foo>
 * // Quux : { key: 'bar', value: number }
 *         | { key: 'baz', value: string }
 *         | { key: 'zot', value: boolean }
 *
 * // you can also narrow the fields you care about
 * type Xyzzy = ExtractKeyValuePairs<Foo, 'bar' | 'baz'>
 * // Xyzzy : { key: 'bar', value: number }
 *          | { key: 'baz', value: string }
 */
export type ExtractKeyValuePairs<
  T,
  K extends keyof T = keyof T
> = K extends keyof T ? { key: K; value: T[K] } : never

/**
 * Elevates a sub-property to the level of the property of an object, leaving
 * everything else the same.
 *
 * @example
 * type Foo = { key: string, value: { tag: string, value: number } }
 * type Bar = RaiseSubProperty<Foo, 'value', 'tag'>
 * // Bar : { key: string, value: string }
 */
export type RaiseSubProperty<
  T,
  K extends keyof T,
  SK extends keyof T[K]
> = Pick<T, Exclude<keyof T, K>> & { [k in K]: T[K][SK] }

/**
 * RaiseSubProperty but for union types; useful in conjunction with
 * ExtractKeyValuePairs
 *
 * @link RaiseSubProperty
 */
export type DistributiveRaiseSubProperty<
  T,
  K extends keyof T,
  SK extends keyof T[K]
> = T extends {} ? RaiseSubProperty<T, K, SK> : never

/**
 * The opposite of Exclude, checks to see what values extends a given value.
 * @example
 *
 * type OneTwoThree = 1 | 2 | 3
 * type A = OneTwoThree | 4
 * type B = Include<A, OneTwoThree> // B === OneTwoThree
 */
export type Include<A, B> = A extends B ? A : never

/**
 * Given an object type, represents a strict subset of the key/value pairs of
 * that object.
 */
export type StrictPartial<T> = keyof T extends infer K
  ? K extends string | symbol | number
    ? Partial<Omit<T, K>> & { [Key in K]?: undefined }
    : never
  : never

/**
 * Given an object type, returns only the keys which have defined properties
 */
export type DefinedKeysOf<T> = keyof T extends infer K
  ? K extends keyof T
    ? T[K] extends undefined
      ? never
      : K
    : never
  : never

export type OptionalToOption<T> = {
  [K in keyof T]-?: undefined extends T[K]
    ? Option<OptionalToOption<Exclude<T[K], undefined>>>
    : OptionalToOption<T[K]>
}
