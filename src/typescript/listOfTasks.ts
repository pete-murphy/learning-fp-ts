import * as A from "fp-ts/lib/Array"
import * as T from "fp-ts/lib/Task"
import { traverse_ } from "fp-ts/lib/Foldable"
import {
  identity,
  Lazy,
} from "fp-ts/lib/function"
import { sequenceT } from "fp-ts/lib/Apply"
import { IO } from "fp-ts/lib/IO"

const formEntryTasks: Array<T.Task<IO<void>>> = [
  T.delay(100)(T.of(() => console.log(1))),
  T.delay(100)(T.of(() => console.log(2))),
  T.delay(100)(T.of(() => console.log(3))),
  T.delay(100)(T.of(() => console.log(4))),
]

const foo = formEntryTasks.reduce(
  (acc, next) => T.chain(_ => next)(acc),
  T.of(() => {})
)

foo().then(x => x()) //?

// traverse_(T.task, A.array)(formEntryTasks, identity)()
// sequenceT(T.task)(formEntryTasks)

// formEntryTasks
