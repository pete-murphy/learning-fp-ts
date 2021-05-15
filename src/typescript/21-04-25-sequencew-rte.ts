import * as RTE from "fp-ts/ReaderTaskEither"
import ReaderTaskEither = RTE.ReaderTaskEither

const sequenceArrayW: <RTEs>(
  rtes: RTEs
) => RTEs extends ReadonlyArray<ReaderTaskEither<infer R, infer E, infer A>>
  ? ReaderTaskEither<R, E, ReadonlyArray<A>>
  : never = RTE.sequenceArray as any

/**************** USAGE ****************/

type Foo = { foo: string }
type Bar = { bar: string }
type Baz = { baz: string }

declare const rte1: ReaderTaskEither<Foo, "a", string>
declare const rte2: ReaderTaskEither<Bar, "b", string>
declare const rte3: ReaderTaskEither<Baz, "c", string>

// Correctly infers as ReaderTaskEither<Foo & Bar & Baz, "a" | "b" | "c", ReadonlyArray<string>>
const x = sequenceArrayW([rte1, rte2, rte3])
