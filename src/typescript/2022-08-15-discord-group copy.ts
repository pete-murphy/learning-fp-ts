import { Group } from "fp-ts/Group"
import { Eq } from "fp-ts/Eq"
import * as RA from "fp-ts/ReadonlyArray"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/function"
import { N } from "./lib/fp-ts-imports"

type FreeGroup<A> = ReadonlyArray<E.Either<A, A>>

const canonical =
  <A>(Eq: Eq<A>) =>
  (xs: FreeGroup<A>): FreeGroup<A> => {
    let ys: Array<E.Either<A, A>> = []
    for (const x of xs) {
      if (ys.length > 0 && E.isLeft(ys[0]) && E.isRight(x)) {
        Eq.equals(x.right, ys[0].left) ? ys.shift() : ys.push(x)
      } else if (ys.length > 0 && E.isRight(ys[0]) && E.isLeft(x)) {
        Eq.equals(x.left, ys[0].right) ? ys.shift() : ys.push(x)
      } else ys.push(x)
    }
    return ys
  }

const group = <A>(Eq: Eq<A>): Group<FreeGroup<A>> => {
  const { empty, concat } = RA.getMonoid<E.Either<A, A>>()
  return {
    concat: flow(concat, canonical(Eq)),
    empty: empty,
    inverse: RA.map(E.swap)
  }
}

const xs: FreeGroup<number> = [E.left(1), E.right(2), E.left(3)]

const { concat, inverse } = group(N.Eq)

canonical(N.Eq)([E.right(1), E.left(2)]) //?
canonical(N.Eq)([E.right(2), E.left(2)]) //?
canonical(N.Eq)([E.left(2), E.right(2)]) //?
canonical(N.Eq)([E.right(2), E.right(2)]) //?
canonical(N.Eq)([E.left(1), E.right(2)]) //?

// const zs = concat(xs, inverse(xs)) //?
// concat(inverse(xs), xs) //?
// zs
