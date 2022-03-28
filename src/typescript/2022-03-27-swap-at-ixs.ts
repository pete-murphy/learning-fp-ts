import { constVoid } from "fp-ts/lib/function"
import * as T from "monocle-ts/Traversal"
import {
  IO,
  flow,
  pipe,
  Tree,
  Com,
  N,
  identity,
  RA,
  O
} from "./lib/fp-ts-imports"

declare const swapItemsAtIndexes: (
  oldIndex: number
) => (newIndex: number) => IO.IO<void>

declare const oldIndexOption: O.Option<number>
declare const newIndexOption: O.Option<number>

pipe(
  O.Do,
  O.apS("oldIndex", oldIndexOption),
  O.apS("newIndex", newIndexOption),
  O.match(
    () => IO.of(void 0),
    ({ oldIndex, newIndex }) =>
      swapItemsAtIndexes(oldIndex)(newIndex)
  )
)()

// const swapItemsAtIndexes =
//   (i: number) =>
//   (j: number) =>
//   <A>(xs: ReadonlyArray<A>): O.Option<ReadonlyArray<A>> =>
//     pipe(
//       O.Do,
//       O.apS("x", RA.lookup(i)(xs)),
//       O.apS("y", RA.lookup(j)(xs)),
//       O.map(({ x, y }) =>
//         pipe(
//           xs,
//           RA.mapWithIndex((k, a) =>
//             k === i ? y : k === j ? x : a
//           )
//         )
//       )
//     )

// const swapItemsAtIndexes_ = <A>(i:number, j: number):
//   (f: (xs: ReadonlyArray<A>) => ReadonlyArray<A>) => pipe(
//     T.id<ReadonlyArray<A>>()
//   )

pipe([1, 2, 3, 4], swapItemsAtIndexes(0)(3)) //?
