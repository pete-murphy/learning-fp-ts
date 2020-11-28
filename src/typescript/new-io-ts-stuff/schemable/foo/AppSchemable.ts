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

export interface AppSchemable<S> {
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(
    members: {
      [K in keyof A]: HKT<S, A[K]>
    }
  ) => HKT<S, A[keyof A]>
}

export interface AppSchemable1<S extends URIS> {
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(
    members: {
      [K in keyof A]: Kind<S, A[K]>
    }
  ) => Kind<S, A[keyof A]>
}

export interface AppSchemable2C<S extends URIS2, E> {
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(
    members: {
      [K in keyof A]: Kind2<S, E, A[K]>
    }
  ) => Kind2<S, E, A[keyof A]>
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
