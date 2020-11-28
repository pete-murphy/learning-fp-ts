import { Refinement } from "fp-ts/lib/function"

import { Falsy, Nil, Undefinedable } from "./typeLevel"

/**
 *  FP-TS tag
 */
export type TaggedObject<A> = A & { _tag: string }

/**
 * FP-TS data structures are tagged objects
 * but the tag isn't part of the type signature
 * this helps identify those objects.
 */
export const isTaggedObject = <A>(x: unknown): x is TaggedObject<A> =>
  isObject(x) && "_tag" in x

export type GuardedType<G, I = unknown> = G extends Refinement<I, infer T>
  ? T
  : never

/**
 * Will throw a type error if switch cases aren't exhaustive.
 */
export const assertNever = (x: never): never => {
  throw new Error("assertNever check failed. Please check call site.")
}

/** Ensures all actions in reducer are handled in switch statement */
export const endReducer = <T>(state: T, _action: never): T => {
  return state
}

/**
 * Tests whether or not an argument is null (type guard)
 */
export const isNull = (x: unknown): x is null => x === null

/**
 * Tests whether or not an argument is undefined (type guard)
 */
export const isUndefined = (x: unknown): x is undefined => x === undefined

/**
 * Tests whether or not an argument is not undefined (type guard)
 */
export const isNotUndefined = <T>(
  x: Undefinedable<T>
): x is Exclude<T, undefined> => !isUndefined(x)

/**
 * Tests whether or not an argument is null or undefined (type guard)
 */
export const isNil = (x: unknown): x is Nil => isNull(x) || isUndefined(x)

/**
 * Tests whether or not an argument is null or undefined (type guard)
 */
export const isNotNil = <T>(x: T | Nil): x is T => !isNil(x)

export const isBoolean = (x: unknown): x is boolean => x === true || x === false

/**
 * Type guard for the `false` literal of the `boolean` primitive
 */
export const isFalse = (x: unknown): x is false =>
  typeof x === "boolean" && x === false

/**
 * Type guard for the `true` literal of the `boolean` primitive
 */
export const isTrue = (x: unknown): x is true =>
  typeof x === "boolean" && x === true

/**
 * Type guard for the `0` literal of the `number` primitive
 */
export const isZero = (x: unknown): x is 0 => isNumber(x) && x === 0

/**
 * Type guard for the Falsy type
 */
export const isFalsy = (x: unknown): x is Falsy =>
  isNil(x) ||
  isFalse(x) ||
  isEmptyString(x) ||
  isZero(x) ||
  (isNumber(x) && Number.isNaN(x))

/**
 * Type guard for the `string` primitive
 */
export const isString = (x: unknown): x is string => typeof x === "string"

/**
 *
 * @param x Type guard for not the `string` primitive
 */
export const isNotString = <T>(x: T): x is Exclude<T, string> =>
  typeof x !== "string"

/**
 * Type guard for the `''` literal of the `string` primitive
 */
export const isEmptyString = (x: unknown): x is "" => isString(x) && x === ""

/**
 * Type guard for `string` primitives that are not `''`
 */
export const isNonEmptyString = (x: unknown): x is string =>
  isString(x) && !isEmptyString(x)

/**
 * Type guard for the `number` primitive
 */
export const isNumber = (x: unknown): x is number => typeof x === "number"

/**
 * The opposite of isNaN (built-in)
 */
export const isNotNaN = (x: unknown): x is number =>
  typeof x === "number" && !isNaN(x)

/**
 * Type guard for finite `number` primitive
 * false for NaN, -Infinity, Infinity
 */
export const isFinite = (x: unknown): x is number =>
  typeof x === "number" && Number.isFinite(x)

/**
 * Type guard for the `object` type
 */
export const isObject = (x: unknown): x is object =>
  !isNull(x) && typeof x === "object" && x instanceof Object

/**
 * Type guard for the `Function` type
 */
// tslint:disable-next-line: ban-types
export const isFunction = (x: unknown): x is Function => x instanceof Function

/**
 * Type guard for the `Array` type
 */
export const isArray = <T>(as: Array<T> | unknown): as is Array<T> =>
  Array.isArray(as)

/**
 * Type guard for the `Array` type with `.length > 0`
 * NOTE: this is *not* an fp-ts NonEmptyArray
 */
export const isNonEmptyArray = <T>(as: Array<T> | unknown): as is Array<T> =>
  isArray(as) && as.length > 0

/**
 * Type guard for the `Array<boolean>` type
 */
export const isBooleanArray = (as: unknown): as is Array<boolean> =>
  isArray(as) && as.every(isBoolean)

/**
 * Type guard for the `Array<number>` type
 */
export const isNumberArray = (as: unknown): as is Array<number> =>
  isArray(as) && as.every(isNumber)

/**
 * Type guard for the `Array<string>` type
 */
export const isStringArray = (as: unknown): as is Array<string> =>
  isArray(as) && as.every(isString)

/**
 * Typeguard for making sure a key is in an object when the object has no index signature
 */
export function hasKey<O, K extends string | number | symbol>(
  obj: O,
  key: K
): obj is O & { [k in K]: unknown } {
  return key in obj
}
