import {
  pipe,
  O,
  RTE,
  TE,
  Re as R
} from "./lib/fp-ts-imports"

interface C {
  c: {}
}
interface Va {
  va: {}
}
interface Vb {
  vb: {}
}

declare const fa: () => TE.TaskEither<Error, C>
declare const fb: RTE.ReaderTaskEither<C, Error, Va>
declare const fd: RTE.ReaderTaskEither<Va & C, Error, Vb>
declare const fe: RTE.ReaderTaskEither<Va & C, Error, Vb>

const fc: RTE.ReaderTaskEither<Va & C, Error, Vb> = pipe(
  fd,
  RTE.apSecond(fe)
)

// const x: RTE.ReaderTaskEither<C, Error, Vb> = pipe(
//   RTE.fromTaskEither(fa()),
//   RTE.apSecond(fb),
//   RTE.chain(va => )
// )
