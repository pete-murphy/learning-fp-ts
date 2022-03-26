import * as SRTE from "fp-ts/StateReaderTaskEither"
import * as RTE from "fp-ts/ReaderTaskEither"
import * as TE from "fp-ts/TaskEither"
import * as Eq from "fp-ts/Eq"
import * as RA from "fp-ts/ReadonlyArray"
import * as O from "fp-ts/Option"
import * as N from "fp-ts/number"
import * as E from "fp-ts/Either"
import * as fs from "fs/promises"
import { pipe } from "fp-ts/function"
import * as Store from "fp-ts/Store"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"

// const createLogger = pipe(
//   TE.Do,

//   TE.tryCatch(mkLogger() ))

export const findA2_ =
  <T extends unknown>(target: readonly (readonly T[])[]) =>
  (
    input: readonly (readonly T[])[]
  ): [number, number][] => {
    let indices: [number, number][] = []
    for (let x = 0; x < input.length; x++) {
      for (let y = 0; y < input[x].length; y++) {
        if (
          (function () {
            for (let tx = 0; tx < target.length; tx++) {
              for (
                let ty = 0;
                ty < target[tx].length;
                ty++
              ) {
                if (
                  target[tx][ty] !==
                  input?.[x + tx]?.[y + ty]
                ) {
                  return false
                }
              }
            }
            return true
          })()
        ) {
          indices = [...indices, [x, y]]
        }
      }
    }
    return indices
  }

const m1: Matrix<number> = [
  [1, 2],
  [3, 4]
]
const m2: Matrix<number> = [[2]]

findA2_(m2)(m1) //?

type Matrix<A> = RNEA.ReadonlyNonEmptyArray<
  ReadonlyArray<A>
>
type Index = readonly [number, number]
type IndexWithValue<A> = {
  readonly index: Index
  readonly value: A
}

const lookupMatrix =
  ([i, j]: Index) =>
  <A>(matrix: Matrix<A>): O.Option<A> =>
    pipe(matrix, RA.lookup(i), O.chain(RA.lookup(j)))

// const getEqMatrix

const matrixToStore = <A>(
  matrix: Matrix<A>
): Store.Store<Index, O.Option<IndexWithValue<A>>> => ({
  peek: ([i, j]) =>
    pipe(
      matrix,
      lookupMatrix([i, j]),
      O.map(value => ({ index: [i, j] as const, value }))
    ),
  pos: [0, 0]
})

const findA2 =
  <A>(eq: Eq.Eq<A>) =>
  (target: Matrix<A>) =>
  (input: Matrix<A>) =>
    //: ReadonlyArray<MatrixIndex>
    pipe(
      target,
      matrixToStore,
      // Store.experiment(O.Functor)(([i, j]) =>
      //   i >= 1 ? O.some([i, j] as const) : O.none
      // )
      Store.experiment(RA.Functor)(([i, j]) =>
        // i >= 1 ? RA.of([i, j] as const) : []
        [[i, j] as const, [i + 1, j] as const]
      )
    )

findA2(N.Eq)(m2)(m1) //?
findA2(N.Eq)(m1)(m1) //?

// const findA2 = <A>(eq: Eq.Eq<A>) => (target: Matrix<A>) => (input: Matrix<A>): ReadonlyArray<MatrixIndex> => {
//   const targetHeight = target.length
//   const targetLength = target[0].length
//   if (targetHeight === 0 || targetLength === 0) return []

// }
