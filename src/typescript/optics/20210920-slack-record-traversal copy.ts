import { flow, pipe, tuple } from "fp-ts/lib/function"
import * as T from "monocle-ts/lib/Traversal"
import { Applicative } from "fp-ts/lib/Applicative"
import { HKT } from "fp-ts/lib/HKT"
import { RA } from "../ssstuff/fp-ts-imports"
import { FunctorWithIndex } from "fp-ts/lib/FunctorWithIndex"
import { TraversableWithIndex } from "fp-ts/lib/TraversableWithIndex"

const getIndexed = <A, FI, I>(FI: TraversableWithIndex<FI, I>): T.Traversal<
  HKT<FI, A>,
  readonly [I, A]
> => ({
  modifyF:
    <F>(F: Applicative<F>) =>
    (f: (array: readonly [number, A]) => HKT<F, readonly [number, A]>) =>
     (_: HKT<FI,A>) => pipe(
        FI.mapWithIndex(_,(i, a: A) => tuple(i, a)),
        FI.traverse(F)(_, f),
        fa =>
          F.map(
            fa,
            FI.map(_, ([_, a]) => a)
          )
      ),
})

// const keyValued: T.Traversal<
//   Record<string, any>,
//   { key: string; value: any }
// > = {
//   modifyF:
//     <F>(F: Applicative<F>) =>
//     (
//       f: (record: {
//         key: string
//         value: any
//       }) => HKT<F, { key: string; value: any }>
//     ) =>
//       flow(
//         Object.entries,
//         Arr.map(([key, value]) => ({ key, value })),
//         Arr.traverse(F)(f),
//         fa =>
//           F.map(
//             fa,
//             flow(
//               Arr.map(({ key, value }) => tuple(key, value)),
//               Object.fromEntries
//             )
//           )
//       ),
// }

// const example = {
//   foo1: "foo1",
//   foo2: true,
//   bar1: "hello",
//   bar2: () => {},
// }

// pipe()

// console.log(
//   pipe(
//     // keyValued,
//     // T.filter(({ key }) => key.startsWith("foo")),
//     // T.modify(({ key, value }) => ({ key: key.toLocaleUpperCase(), value })),
//     keyValued,
//     T.getAll
//   )(example)
// )
