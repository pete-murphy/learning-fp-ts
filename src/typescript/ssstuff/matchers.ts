import { Exact, TaggedUnionMember } from "typelevel-ts"
import * as O from "fp-ts/Option"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"

import { hasKey } from "./typeGuards"
import { DefinedKeysOf, StrictPartial } from "./typeLevel"
import { pipe } from "fp-ts/lib/function"

type TaggedOnKey<K extends string> = { [k in K]: string }

/**
 * An object whose properties are the values of a tagged union's discriminant,
 * and whose values are functions taking the corresponding tagged union member
 * and returning an `Out`.
 */
type Matchers<Key extends string, TaggedUnion extends TaggedOnKey<Key>, Out> = {
  [D in TaggedUnion[Key]]: (v: TaggedUnionMember<TaggedUnion, Key, D>) => Out
}

type PropReturns<T> = ReturnType<T[DefinedKeysOf<T>]>

interface PartialMatch<K extends string> {
  <TU extends TaggedOnKey<K>, Z>(
    matchObj: StrictPartial<Matchers<K, TU, Z>>,
    otherwise: () => Z
  ): (tu: TU) => Z
  <TU extends TaggedOnKey<K>, Z>(matchObj: StrictPartial<Matchers<K, TU, Z>>): (
    tu: TU
  ) => O.Option<Z>
}

interface InvertedPartialMatch<K extends string, TU extends TaggedOnKey<K>> {
  <Z>(matchObj: StrictPartial<Matchers<K, TU, Z>>, otherwise: () => Z): Z
  <Z>(matchObj: StrictPartial<Matchers<K, TU, Z>>): O.Option<Z>
}
interface PartialWideningMatch<K extends string> {
  <
    TU extends TaggedOnKey<K>,
    Z,
    Ms extends StrictPartial<Matchers<K, TU, unknown>>
  >(
    matchObj: Ms,
    otherwise: () => Z
  ): (tu: TU) => Z | PropReturns<Ms>
  <
    TU extends TaggedOnKey<K>,
    Ms extends StrictPartial<Matchers<K, TU, unknown>>
  >(
    matchObj: Ms
  ): (tu: TU) => O.Option<PropReturns<Ms>>
}
interface InvertedPartialWideningMatch<
  K extends string,
  TU extends TaggedOnKey<K>
> {
  <Z, Ms extends StrictPartial<Matchers<K, TU, unknown>>>(
    matchObj: Ms,
    otherwise: () => Z
  ): Z | PropReturns<Ms>
  <Ms extends StrictPartial<Matchers<K, TU, unknown>>>(matchObj: Ms): O.Option<
    PropReturns<Ms>
  >
}

interface Match<K extends string> {
  /**
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' }
   * pipe(
   *   foo,
   *   match({
   *     bar: () => 1,
   *     baz: () => 2,
   *   }),
   * )
   */
  <TU extends TaggedOnKey<K>, Z>(matchObj: Matchers<K, TU, Z>): (tu: TU) => Z

  /**
   * Inverted argument order
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' }
   * match.i(foo)({
   *   bar: () => 1,
   *   baz: () => 2,
   * })
   */
  i: <TU extends TaggedOnKey<K>>(
    tu: TU
  ) => <Z>(matchObj: Matchers<K, TU, Z>) => Z
  /**
   * Partial matching
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' }
   * pipe(
   *   foo,
   *   match.p(
   *     {
   *       bar: () => 1,
   *     },
   *     () => 2,
   *   ),
   * ) // :: number
   *
   * pipe(
   *   foo,
   *   match.p(
   *     {
   *       bar: () => 1,
   *     },
   *   ),
   * ) // :: Option<number>
   */
  p: PartialMatch<K>
  /**
   * Widening
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' }
   * pipe(
   *   foo,
   *   match.w({
   *     () => 3,
   *     () => 'three',
   *   }),
   *   // :: number | string
   * )
   */
  w: <
    TU extends TaggedOnKey<K>,
    Ms extends Exact<Matchers<K, TU, unknown>, Ms>
  >(
    matchObj: Ms
  ) => (tu: TU) => PropReturns<Ms>

  /**
   * Inverted, partial
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' }
   * match.ip(foo)(
   *   {
   *     bar: () => 1,
   *   },
   *   () => 5,
   * ) // :: number
   *
   * match.ip(foo)({
   *   bar: () => 1,
   * }) // :: Option<number>
   */
  ip: <TU extends TaggedOnKey<K>>(tu: TU) => InvertedPartialMatch<K, TU>

  /**
   * Inverted, widening
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' }
   * match.iw(foo)({
   *   bar: () => 1,
   *   baz: () => 'baz',
   * }) // :: number | string
   */
  iw: <TU extends TaggedOnKey<K>>(
    tu: TU
  ) => <Z, Ms extends Exact<Matchers<K, TU, Z>, Ms>>(
    matchObj: Ms
  ) => PropReturns<Ms>

  /**
   * Partial, widening
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' } | { tag: 'quux' }
   * pipe(
   *   foo,
   *   match.pw(
   *     {
   *       bar: () => 1,
   *       baz: () => '2',
   *     },
   *     () => false,
   *   ),
   * ) // :: number | string | boolean
   *
   * pipe(
   *   foo,
   *   match.pw({
   *     bar: () => 1,
   *     baz: () => '2',
   *   }),
   * ) // :: Option<number | string>
   */
  pw: PartialWideningMatch<K>

  /**
   * Inverted, partial, widening
   * @example
   * declare const foo: { tag: 'bar' } | { tag: 'baz' } | { tag: 'quux' }
   * match.ipw(foo)(
   *   {
   *     bar: () => 1,
   *     baz: () => '2',
   *   },
   *   () => false
   * ) // :: number | string | boolean
   *
   * match.ipw(foo)({
   *   bar: () => 1,
   *   baz: () => '2',
   * }) // :: Option<number | string>
   */
  ipw: <TU extends TaggedOnKey<K>>(
    tu: TU
  ) => InvertedPartialWideningMatch<K, TU>
}

interface MatchOn {
  on: <K extends string>(key: K) => Match<K>
}

const matchOnKey = <K extends string>(key: K): Match<K> =>
  Object.assign(
    <TaggedUnion extends TaggedOnKey<K>, Z>(
        matchObj: Matchers<K, TaggedUnion, Z>
      ) =>
      (tu: TaggedUnion): Z =>
        matchObj[tu[key]](
          tu as TaggedUnionMember<TaggedUnion, K, typeof tu[K]>
        ),
    {
      i:
        <TaggedUnion extends TaggedOnKey<K>>(tu: TaggedUnion) =>
        <Z>(matchObj: Matchers<K, TaggedUnion, Z>): Z =>
          matchObj[tu[key]](
            tu as TaggedUnionMember<TaggedUnion, K, typeof tu[K]>
          ),

      p:
        <TaggedUnion extends TaggedOnKey<K>, Z>(
          matchObj: StrictPartial<Matchers<K, TaggedUnion, Z>>,
          otherwise?: () => Z
        ) =>
        (tu: TaggedUnion) => {
          const matchedTag = tu[key]
          const f:
            | false
            | ((tu_: TaggedUnionMember<TaggedUnion, K, typeof tu[K]>) => Z) =
            hasKey(matchObj, matchedTag) && matchObj[matchedTag]
          if (f) {
            const ret = f(tu as TaggedUnionMember<TaggedUnion, K, typeof tu[K]>)
            return otherwise ? ret : O.some(ret)
          }
          return otherwise ? otherwise() : O.none
        },

      w:
        <TaggedUnion extends TaggedOnKey<K>>(
          matchObj: Matchers<K, TaggedUnion, unknown>
        ) =>
        (tu: TaggedUnion): PropReturns<typeof matchObj> =>
          matchObj[tu[key]](
            tu as TaggedUnionMember<TaggedUnion, K, typeof tu[K]>
          ) as PropReturns<typeof matchObj>,

      ip:
        <TaggedUnion extends TaggedOnKey<K>>(tu: TaggedUnion) =>
        <Z>(
          matchObj: StrictPartial<Matchers<K, TaggedUnion, Z>>,
          otherwise?: () => Z
        ) =>
          otherwise
            ? matchOnKey(key).p(matchObj, otherwise)(tu)
            : matchOnKey(key).p(matchObj)(tu),

      iw:
        <TaggedUnion extends TaggedOnKey<K>>(tu: TaggedUnion) =>
        <Z>(matchObj: Matchers<K, TaggedUnion, Z>) =>
          matchObj[tu[key]](
            tu as TaggedUnionMember<TaggedUnion, K, typeof tu[K]>
          ) as PropReturns<typeof matchObj>,

      pw:
        <
          TaggedUnion extends TaggedOnKey<K>,
          Z,
          Ms extends StrictPartial<Matchers<K, TaggedUnion, unknown>>
        >(
          matchObj: Ms,
          otherwise?: () => Z
        ) =>
        (tu: TaggedUnion) => {
          const matchedTag = tu[key]
          const f:
            | false
            | ((
                tu_: TaggedUnionMember<TaggedUnion, K, typeof tu[K]>
              ) => PropReturns<Ms>) =
            hasKey(matchObj, matchedTag) && matchObj[matchedTag]
          if (f) {
            const ret = f(tu as TaggedUnionMember<TaggedUnion, K, typeof tu[K]>)
            return otherwise ? ret : O.some(ret)
          }
          return otherwise ? otherwise() : O.none
        },

      ipw:
        <TaggedUnion extends TaggedOnKey<K>>(tu: TaggedUnion) =>
        <Z, Ms extends StrictPartial<Matchers<K, TaggedUnion, unknown>>>(
          matchObj: Ms,
          otherwise?: () => Z
        ) =>
          otherwise
            ? matchOnKey(key).pw(matchObj, otherwise)(tu)
            : matchOnKey(key).pw(matchObj)(tu),
    }
  )

export const match: Match<"tag"> & MatchOn = Object.assign(matchOnKey("tag"), {
  on: matchOnKey,
})

/** @deprecated use match.i */
export const matchI = match.i
/** @deprecated use match.on */
export const matchOn = matchOnKey
/** @deprecated use match.on(key).i */
export const matchOnI = <K extends string>(key: K) => match.on(key).i

export const matchS =
  <S extends string>(s: S) =>
  <Out>(matchObj: { [M in S]: () => Out }): Out =>
    matchObj[s]()

// i: <TU extends TaggedOnKey<K>>(
//   tu: TU
// ) => <Z>(matchObj: Matchers<K, TU, Z>) => Z
// export const matchIT = <TU extends TaggedOnKey<"tag">>(
//   ...tus: RNEA.ReadonlyNonEmptyArray<TU>
// ) => <Z>(matchObj: Matchers<"tag", TU, Z>): O.Option<Z> =>
//   pipe(
//     RNEA.uncons(tus),
//     ([tu, tus_]) =>
//       pipe(
//         tu,
//         O.fromPredicate(({ tag }) => tus_.every(tu_ => tu_.tag === tag))
//       ),
//     match.i(tu)()
//   )
