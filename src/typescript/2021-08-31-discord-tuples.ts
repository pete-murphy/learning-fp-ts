import { RA as A, flow, pipe, O, RTup as Tup } from "./ssstuff/fp-ts-imports"

export const selectFirstFromTuples = <T extends unknown>(
  elements: Array<[T, boolean]>,
  fallback: T | undefined = undefined
) =>
  pipe(
    elements,
    A.findFirstMap(([t, b]) => (b ? O.some(t) : O.none)),
    O.getOrElseW(() => fallback)
  )
