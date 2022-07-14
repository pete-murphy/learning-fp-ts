import { identity, O, pipe } from "./lib/fp-ts-imports"

type Nullable<A> = A | undefined | null

const flatten = <A>(
  mma: Nullable<Nullable<A>>
): Nullable<A> => mma

// const ap = <A, B>(f: Nullable<(_:A) => B>) => (fa: Nullable<A>): Nullable<B> =>

pipe(
  O.some(O.none),
  O.alt(() => O.some(O.some(3)))
) //?

false ?? true //?
// undefined ??

const fa = null
const f = identity
pipe(fa, O.fromNullable, O.map(f), O.toUndefined) //?
