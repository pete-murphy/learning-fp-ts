import * as AP from "fp-ts/lib/Apply"
import * as T from "fp-ts/lib/Task"
const ado = AP.sequenceT(T.task)
const bools = [true, true, true]
const tasks = bools.map(b => T.of(b))

ado(...[tasks[0], ...tasks.slice(1)])

T.sequenceArray(tasks)
