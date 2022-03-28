import { Eq, N, pipe, RA, RNEA } from "./lib/fp-ts-imports"

export const toggle =
  <A>(eq: Eq.Eq<A>) =>
  (a: A) =>
  (as: ReadonlyArray<A>) =>
    (RA.elem(eq)(a, as) ? RA.difference : RA.union)(eq)(
      as,
      [a]
    )

const xs: RNEA.ReadonlyNonEmptyArray<number> = [1]

pipe(xs, toggle(N.Eq)(1)) //?
