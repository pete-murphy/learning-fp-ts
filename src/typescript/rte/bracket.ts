import * as R from "fp-ts/lib/Reader"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as TE from "fp-ts/lib/TaskEither"
import * as T from "fp-ts/lib/Task"

interface Effect<A> extends TE.TaskEither<Array<Error>, A> {}

type QueryResult = unknown

interface R {
  readonly connect: Effect<void>
  readonly query: (q: string) => Effect<QueryResult>
  readonly close: Effect<void>
}

interface App<A> extends R.Reader<R, Effect<A>> {}

const connect: App<void> = r => r.connect
const query: App<QueryResult> = r => r.query(`some cool query`)
const close: App<void> = r => r.close
const program: App<QueryResult> = RTE.bracket(
  connect,
  () => query,
  () => close
)
const testOk: R = {
  connect: TE.rightIO(() => console.log("connect called")),
  query: q => TE.rightIO(() => console.log("query called, q:", q)),
  close: TE.rightIO(() => console.log("close called")),
}
// use this to see bracket in action
const testKo: R = {
  connect: TE.rightIO(() => console.log("connect called")),
  query: () => TE.left([new Error("Bad")]),
  close: TE.rightIO(() => console.log("close called")),
}

program(testOk)()
/*
connect called
query called, q: some cool query
close called
*/

T.delay(100)(program(testKo))()
/*
connect called
close called
*/
