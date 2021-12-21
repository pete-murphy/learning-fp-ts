import {
  function as F,
  io as IO,
  taskEither as TE,
  ioEither as IOE,
  task as T,
} from "fp-ts"

type Credentials = {
  name: string
  pw: string
}

declare const save: (s: Credentials) => IO.IO<void>
declare const send: (s: Credentials) => IO.IO<void>

declare const getData: (uid: string) => TE.TaskEither<string, Credentials>

const saveTE: (s: Credentials) => TE.TaskEither<string, void> = s =>
  F.pipe(
    IOE.tryCatch(save(s), () => "Failed to save"),
    TE.fromIOEither
  )

const sendTE: (s: Credentials) => TE.TaskEither<string, void> = s =>
  F.pipe(
    IOE.tryCatch(send(s), () => "Failed to send"),
    TE.fromIOEither
  )

// const saveAndSend = (uid: string): TE.TaskEither<string, void> =>
//   F.pipe(
//     uid,
//     getData,
//     TE.chain(credentials =>
//       F.pipe(saveTE(credentials), TE.apSecond(sendTE(credentials)))
//     )
//   )
const saveAndSend = (uid: string): TE.TaskEither<string, void> =>
  F.pipe(
    uid,
    getData,
    TE.chain(credentials =>
      F.pipe(save(credentials), IO.apSecond(send(credentials)), TE.fromIO)
    )
  )

const saveTE_ = F.flow(save, TE.fromIO)
const sendTE_ = F.flow(send, TE.fromIO)

// const saveAndSend = (uid: string): TE.TaskEither<string, void> =>
//   F.pipe(
//     uid,
//     getData,
//     TE.chain(c => F.pipe([save(c), send(c)], IO.sequenceArray, TE.fromIO))
//   )
