import { Eq } from "fp-ts/lib/Eq"

export const difference: <A extends object>(
  E: Eq<A>
) => (x: A, y: A) => Partial<A> = {}
