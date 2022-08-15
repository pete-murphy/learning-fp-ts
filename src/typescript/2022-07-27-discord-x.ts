import { O, pipe } from "./lib/fp-ts-imports"

export const mapToOption =
  <A, B>(f: (a: A) => O.Option<B>) =>
  (fa: ReadonlyArray<A>): O.Option<ReadonlyArray<B>> => {
    const fb = new Array<B>(fa.length)
    for (let i = 0; i < fa.length; i++) {
      const result = f(fa[i])
      if (O.isNone(result)) return O.none
      else fb[i] = result.value
    }
    return O.some(fb)
  }

const xs = [
  () => 1,
  () => 2,
  () => 3
  // () => {
  //   throw Error("Oops")
  // }
]

pipe(
  xs,
  mapToOption(f => (f() < 4 ? O.some(f()) : O.none))
) //?

pipe(
  xs,
  O.traverseArray(f => (f() < 4 ? O.some(f()) : O.none))
) //?
