import { pipe } from "fp-ts/lib/function"
import * as StT from "fp-ts/lib/StateT"
import * as T from "fp-ts/lib/Task"
import * as RA from "fp-ts/lib/ReadonlyArray"
import { Monad2 } from "fp-ts/lib/Monad"

const files: Record<string, string> = {
  a: "c",
  b: "f",
  c: "b",
  d: "e",
  e: "a",
  f: "d",
}

// Stubbing Node `fs` module
const fs = {
  promises: {
    readFile: (filename: string, _encoding: string) =>
      Promise.resolve(files[filename]),
  },
}

// fp-ts/StateTask module
export interface StateTask<S, A> {
  (s: S): T.Task<[A, S]>
}

export const URI = "StateTask"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: StateTask<E, A>
  }
}

const StateTask: Monad2<URI> = {
  URI,
  map: (fa, f) => pipe(fa, StT.map(T.Functor)(f)),
  ap: (fab, fa) => pipe(fab, StT.ap(T.Chain)(fa)),
  of: StT.of(T.Pointed),
  chain: (fa, f) => pipe(fa, StT.chain(T.Chain)(f)),
}

// A "stateful" task that gets a filename from state, reads the contents
// and puts the contents of the file as the "next" filename state
const fileTask: StateTask<string, string> = pipe(filename =>
  pipe(
    () => fs.promises.readFile(filename, "utf8"),
    T.map(contents => [
      `Read from ${filename}, contents: ${JSON.stringify(contents)}`,
      contents,
    ])
  )
)

pipe(
  RA.replicate(10, fileTask),
  RA.sequence(StateTask),
  StT.evaluate(T.Functor)("a")
)().then(console.log)
// [ 'Read from a, contents: "c"',
//   'Read from c, contents: "b"',
//   'Read from b, contents: "f"',
//   'Read from f, contents: "d"',
//   'Read from d, contents: "e"',
//   'Read from e, contents: "a"',
//   'Read from a, contents: "c"',
//   'Read from c, contents: "b"',
//   'Read from b, contents: "f"',
//   'Read from f, contents: "d"' ]
