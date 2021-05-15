import { flow, pipe, tuple } from "fp-ts/lib/function"
import * as L from "monocle-ts/lib/Lens"

const updateAt = <I extends number>(i: I) => <
  T extends ReadonlyArray<unknown>,
  B
>(
  f: (a: T[I]) => B
) => flow(pipe(L.id<T>(), L.prop(i), L.modify(f)), xs => Object.values(xs))

const ex: [number, string, {}, number] = [0, "a", {}, 9]
const ex2 = pipe(
  ex,
  updateAt(3)(x => x + 1)
) //?
