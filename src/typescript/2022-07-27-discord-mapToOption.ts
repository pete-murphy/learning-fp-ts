import { constant, Lazy } from "fp-ts/lib/function"
import { O, pipe, RA, RNEA } from "./lib/fp-ts-imports"

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

export const mapToOption_ =
  <A, B>(f: (a: A) => O.Option<B>) =>
  (fa: ReadonlyArray<A>): O.Option<ReadonlyArray<B>> => {
    const fb = new Array<B>()
    for (let i = 0; i < fa.length; i++) {
      const result = f(fa[i])
      if (O.isNone(result)) return O.none
      else fb.push(result.value)
    }
    return O.some(fb)
  }

const xs: ReadonlyArray<Lazy<number>> = pipe(
  RNEA.range(0, 10_000_000),
  RNEA.map(constant),
  RA.append((): number => {
    throw Error("Just checking we're not evaluating everything in the array")
  })
)

const test = (f: Lazy<number>) => {
  const n = f()
  return n < 10_000 ? O.some(n) : O.none
}

const main = () => {
  console.time("mapToOption")
  pipe(xs, mapToOption(test))
  console.timeEnd("mapToOption")

  console.time("traverseArray")
  pipe(xs, O.traverseArray(test))
  console.timeEnd("traverseArray")

  console.time("mapToOption_")
  pipe(xs, mapToOption_(test))
  console.timeEnd("mapToOption_")
}

main()
