import { aff, chain } from "./Aff"
import { pipe } from "fp-ts/lib/pipeable"

function getLoggers(logs: Array<string | number>) {
  const log = (s: string | number) => () => {
    logs.push(s)
  }
  const error = (e: Error) => log(e.message)
  return { log, error }
}

const logs: Array<string | number> = []
const { log, error } = getLoggers(logs)
const aio1 = pipe(
  aff.of("a"),
  chain(() => aff.of(1))
)
// const aio1 = of('a').chain(() => of(1))
aio1(error, log)
logs

let counter = 0

const affA = aff.fromIO(() => {
  counter += 1
  return "a"
})

const affB = aff.fromIO(() => {
  counter += 1
  return "a"
})

const affC = pipe(
  affA,
  chain((s) => affB)
)

affC(
  (x) => () => console.error(x),
  (s) => () => console.log(s)
)

aff.of(1)(
  (e) => () => console.error(e.message),
  (s: number) => () => console.log(s)
)

aff.fromIO(() => 1)(
  (e) => () => console.log(e.message),
  (n) => () => console.log(n)
)
