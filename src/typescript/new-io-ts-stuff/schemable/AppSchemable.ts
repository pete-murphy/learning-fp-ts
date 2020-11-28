import * as t from "io-ts"
import { NonEmptyString, UUID } from "io-ts-types"
import {
  memoize,
  Schemable,
  Schemable1,
  Schemable2C,
  WithRefine,
  WithRefine1,
  WithRefine2C,
  WithUnion,
  WithUnion1,
  WithUnion2C,
  WithUnknownContainers,
  WithUnknownContainers1,
  WithUnknownContainers2C,
} from "io-ts/lib/Schemable"
import { Iso } from "monocle-ts"
import { AnyNewtype, CarrierOf } from "newtype-ts"
import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/lib/HKT"
import { Option } from "fp-ts/lib/Option"

export type AppSchema<A> = <S>(schemable: AppSchemable<S>) => HKT<S, A>

export type TypeOf<S> = S extends AppSchema<infer A> ? A : never

/**
 * `AppSchemable` extends the default `Schemable` interface from `io-ts` with
 * extra instances for types we've needed in the various domains of our app,
 * such as `Date`, `NonEmptyString`, `Int`, etc. This may safely be extended as
 * needed if new use cases arise for types that aren't covered here.
 */
export interface AppSchemable<S>
  extends Schemable<S>,
    WithUnion<S>,
    WithRefine<S>,
    WithUnknownContainers<S> {
  readonly nonEmptyString: HKT<S, NonEmptyString>
  readonly date: HKT<S, Date>
  readonly int: HKT<S, t.Int>
  readonly uuid: HKT<S, Uuid>
  /**
   * @example
   * ```ts
   * interface USD extends Newtype<{ readonly USD: unique symbol }, number> {}
   * interface EUR extends Newtype<{ readonly EUR: unique symbol }, number> {}
   *
   * const TransactionSchema = createSchema(s =>
   *   s.type({
   *     amount: s.newtype(s.number, iso<EUR>()),
   *     from: s.string,
   *     to: s.string,
   *   }),
   * )
   *
   * const onlyUsd = (x: USD) => x
   * const onlyEur = (x: EUR) => x
   *
   * const example = pipe(
   *   interpreter(DecoderSchemable)(TransactionSchema).decode({
   *     amount: 10,
   *     from: 'Alice',
   *     to: 'Carol',
   *   }),
   *   E.map(t => onlyEur(t.amount)),
   *   // Using `onlyUsd` here will give a nice type error
   *   // > Argument of type 'EUR' is not assignable to parameter of type 'USD'.
   *   // E.map(t => onlyUsd(t.amount))
   * )
   * ```
   */
  readonly newtype: <N extends AnyNewtype>(
    from: HKT<S, CarrierOf<N>>,
    iso: Iso<N, CarrierOf<N>>
  ) => HKT<S, N>
  readonly unknown: HKT<S, unknown>
  readonly option: <A>(value: HKT<S, A>) => HKT<S, Option<A>>
  readonly optionFromNullable: <A>(from: HKT<S, A>) => HKT<S, Option<A>>
  readonly set: <A>(value: HKT<S, A>) => HKT<S, ReadonlySet<A>>
}

export interface AppSchemable1<S extends URIS>
  extends Schemable1<S>,
    WithUnion1<S>,
    WithRefine1<S>,
    WithUnknownContainers1<S> {
  readonly nonEmptyString: Kind<S, NonEmptyString>
  readonly date: Kind<S, Date>
  readonly int: Kind<S, t.Int>
  readonly uuid: Kind<S, Uuid>
  readonly newtype: <N extends AnyNewtype>(
    from: Kind<S, CarrierOf<N>>,
    iso: Iso<N, CarrierOf<N>>
  ) => Kind<S, N>
  readonly unknown: Kind<S, unknown>
  readonly option: <A>(value: Kind<S, A>) => Kind<S, Option<A>>
  readonly optionFromNullable: <A>(value: Kind<S, A>) => Kind<S, Option<A>>
  readonly set: <A>(value: Kind<S, A>) => Kind<S, ReadonlySet<A>>
}

export interface AppSchemable2C<S extends URIS2, E>
  extends Schemable2C<S, E>,
    WithUnion2C<S, E>,
    WithRefine2C<S, E>,
    WithUnknownContainers2C<S, E> {
  readonly nonEmptyString: Kind2<S, E, NonEmptyString>
  readonly date: Kind2<S, E, Date>
  readonly int: Kind2<S, E, t.Int>
  readonly uuid: Kind2<S, E, Uuid>
  readonly newtype: <N extends AnyNewtype>(
    from: Kind2<S, E, CarrierOf<N>>,
    iso: Iso<N, CarrierOf<N>>
  ) => Kind2<S, E, N>
  readonly unknown: Kind2<S, E, unknown>
  readonly option: <A>(value: Kind2<S, E, A>) => Kind2<S, E, Option<A>>
  readonly optionFromNullable: <A>(
    value: Kind2<S, E, A>
  ) => Kind2<S, E, Option<A>>
  readonly set: <A>(value: Kind2<S, E, A>) => Kind2<S, E, ReadonlySet<A>>
}

export function createSchema<A>(schema: AppSchema<A>): AppSchema<A> {
  return memoize(schema)
}

export function interpreter<S extends URIS>(
  schemable: AppSchemable1<S>
): <A>(schema: AppSchema<A>) => Kind<S, A>

// eslint-disable-next-line no-redeclare
export function interpreter<S extends URIS2, E>(
  schemable: AppSchemable2C<S, E>
): <A>(schema: AppSchema<A>) => Kind2<S, E, A>

// eslint-disable-next-line no-redeclare
export function interpreter<S, A>(schemable: S) {
  return (schema: (schemable: S) => HKT<S, A>): HKT<S, A> => {
    return schema(schemable)
  }
}

// @TODO - Pete Murphy 2020-10-02 - Find a better place for this
export type Uuid = t.TypeOf<typeof UUID>
