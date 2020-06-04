import { delay, task } from "fp-ts/lib/Task"

const t1 = delay(100)(task.of(1))
const t2 = delay(100)(task.of(2))
const t3 = delay(100)(task.of(3))
