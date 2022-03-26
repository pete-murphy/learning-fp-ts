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
import * as T from "monocle-ts/Traversal"
// import {Predicate} from "fp-ts/Predicate"

// pipe(
//   a,
//   mapFirst(
//     (aa) => aa === 2,
//     (a) => a + 10
//   )
//   asserts.equals([1, 12, 3, 2])
// )

const mapFirst = <A, B>(
  pred: (a: A) => boolean,
  f: (a: A) => A
): ((as: ReadonlyArray<A>) => ReadonlyArray<A>) =>
  pipe(
    T.id<ReadonlyArray<A>>(),
    T.findFirst(pred),
    T.modify(f)
  )

const a = [1, 2, 3, 2]

pipe(
  a,
  mapFirst(
    aa => aa === 2,
    a => a + 10
  )
) //?
