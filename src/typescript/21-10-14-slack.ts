import {
  function as F,
  io as IO,
  task as T,
  taskEither as TE,
  readerTaskEither as RTE,
} from "fp-ts"

type Credentials = {
  name: string
  pw: string
}

declare const save: (s: Credentials) => IO.IO<void>
declare const send: (s: Credentials) => IO.IO<void>

declare const getData: (uid: string) => TE.TaskEither<string, Credentials>

// const ios = (c: Credentials) => [save(c), send(c)]
// const ios = (c: Credentials): Array<IO.IO<void>> => [save(c), send(c)]
// const ios = (c: Credentials): IO.IO<void> => F.pipe(save(c), send(c))

type AppError =
  | {
      readonly tag: "saveError"
      readonly raw: unknown
    }
  | {
      readonly tag: "sendError"
      readonly raw: unknown
    }

const saveRTE: RTE.ReaderTaskEither<Credentials, AppError, void> = c =>
  TE.tryCatch(T.fromIO(save(c)), raw => ({ tag: "saveError" as const, raw }))

const sendRTE: RTE.ReaderTaskEither<Credentials, AppError, void> = c =>
  TE.tryCatch(T.fromIO(send(c)), raw => ({ tag: "sendError" as const, raw }))

// const saveAndSendRTE: RTE.ReaderTaskEither<Credentials, AppError, void> = 

const saveAndSend = (uid: string): TE.TaskEither<string, void> =>
  F.pipe(
    uid,
    getData,
    TE.chain(c =>
      // F.pipe(
      //   [save(c), send(c)],
      //   IO.sequenceArray,
      //   TE.fromIO,
      //   TE.chain(d => TE.of("") as TE.TaskEither<string, void>)
      // )
    )
  )
