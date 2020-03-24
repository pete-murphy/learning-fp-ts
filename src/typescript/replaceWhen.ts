import * as A from "fp-ts/lib/Array"
import * as O from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import { Predicate, constant } from "fp-ts/lib/function"
import { indexArray } from "monocle-ts/lib/Index/Array"
import { identity } from "io-ts"

// const ys = [1, 2, 3, 2]
// const item = 4
// const myPredicate = (x: number) => x === 2

// const replaceWhen_ = <A>(pred: Predicate<A>, x: A, xs: Array<A>) =>
//   pipe(xs, A.spanLeft(pred), ({ init, rest }) =>
//     init.concat(
//       pipe(
//         rest,
//         A.tail,
//         O.fold(() => [], [x].concat)
//       )
//     )
//   )

const replaceWhen = <A>(pred: Predicate<A>, x: A) => (xs: Array<A>): Array<A> =>
  pipe(
    A.findIndex(pred)(xs),
    O.fold(
      () => identity,
      ix =>
        indexArray<A>()
          .index(ix)
          .set(x)
    )(xs)
  )

console.log(replaceWhen(x => x > 2, 5)([1, 2, 3, 4, 5, 6]))
