import * as fp from "fp-ts"

type R = {
  client: {
    connect(): Promise<unknown>
    query(q: string): Promise<unknown>
    close(): Promise<unknown>
  }
}
type E = Array<Error>

const connectRTE: fp.readerTaskEither.ReaderTaskEither<R, E, unknown> = r =>
  // fp.taskEither.fromEither(
  //   fp.either.tryCatch(
  //     () => r.client.connect(),
  //     e => Array.of(Error(String(e)))
  //   )
  // )
  fp.taskEither.tryCatch(
    () => r.client.connect(),
    e => Array.of(Error(String(e)))
  )

const queryRTE: fp.readerTaskEither.ReaderTaskEither<R, E, unknown> = r =>
  fp.taskEither.tryCatch(
    () => r.client.query(`some cool query`),
    e => Array.of(Error(String(e)))
  )

const closeRTE: fp.readerTaskEither.ReaderTaskEither<R, E, unknown> = r =>
  fp.taskEither.tryCatch(
    () => r.client.close(),
    e => Array.of(Error(String(e)))
  )

const program = fp.pipeable.pipe(
  connectRTE,
  fp.readerTaskEither.chain(() => queryRTE),
  fp.readerTaskEither.chain(() => closeRTE)
)
const client: R["client"] = {
  connect: () => Promise.resolve(console.log("connect called ")),
  query: (q: string) => Promise.resolve(console.log("query called, q: ", q)),
  close: () => Promise.resolve(console.log("close called ")),
}
const runProgram = program({ client })
runProgram()
