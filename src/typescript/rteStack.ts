import { pipe } from "fp-ts/lib/function"
import { HKT } from "fp-ts/lib/HKT"
import { MonadTask } from "fp-ts/lib/MonadTask"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as T from "fp-ts/lib/Task"

const foo = <M>(mt: MonadTask<M>) => <A>(t: HKT<M, A>) => t

foo()
