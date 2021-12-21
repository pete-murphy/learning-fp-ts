import * as T from "fp-ts/Task"
import * as A from "fp-ts/ReadonlyArray"
import * as S from "fp-ts/Separated"
import { flow, pipe } from "fp-ts/function"

import Task = T.Task

declare const getFiles: (path: string) => Task<readonly string[]>
declare const isDirectory: (path: string) => boolean

const getFilesRecursive_ = (path: string): Task<readonly string[]> =>
  pipe(
    getFiles(path),
    T.chain(
      flow(
        A.partition(isDirectory),
        S.bimap(
          flow(T.of),
          flow(T.traverseArray(getFilesRecursive_), T.map(A.flatten))
        ),
        ({ left, right }) => [left, right],
        // T.traverseArray(A.flatten)
        xs => xs,
        T.sequenceArray,
        T.map(A.flatten)
      )
    )
  )

const getFilesRecursive: (path: string) => Task<readonly string[]> = flow(
  getFiles,
  T.chain(
    flow(
      T.traverseArray(file =>
        isDirectory(file) ? T.of([file]) : getFilesRecursive(file)
      ),
      T.map(A.flatten)
    )
  )
)

// A.map(foo),
// A.sequence(T.ApplicativePar),

// T.traverseArray(foo)
