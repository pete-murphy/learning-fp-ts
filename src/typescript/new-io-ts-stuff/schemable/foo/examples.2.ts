import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/HKT"
import {
  memoize,
  Schemable,
  Schemable1,
  Schemable2C,
} from "io-ts/lib/Schemable"
import { iso, Newtype } from "newtype-ts"

export type Schema<A> = <S>(schemable: Schemable<S>) => HKT<S, A>

export function createSchema<A>(schema: Schema<A>): Schema<A> {
  return memoize(schema)
}

export function interpreter<S extends URIS>(
  schemable: Schemable1<S>
): <A>(schema: Schema<A>) => Kind<S, A>

// eslint-disable-next-line no-redeclare
export function interpreter<S extends URIS2, E>(
  schemable: Schemable2C<S, E>
): <A>(schema: Schema<A>) => Kind2<S, E, A>

// eslint-disable-next-line no-redeclare
export function interpreter<S, A>(schemable: S) {
  return (schema: Schemable<S>): HKT<S, A> => {
    return schema(schemable)
  }
}

const FooSchema = createSchema(s =>
  s.sum("tag")({
    fooNum: s.type({
      tag: s.literal("fooNum"),
      contents: s.number,
    }),
    fooNothing: s.type({
      tag: s.literal("fooNothing"),
    }),
  })
)
