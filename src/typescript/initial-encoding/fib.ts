import { flow, pipe } from "fp-ts/lib/function"
import { RNEA } from "../lib/fp-ts-imports"
import * as Ev from "./Eval"

function fib(n: bigint): Ev.Eval<bigint> {
  return Ev.defer(() => {
    if (n <= 1) {
      return Ev.now(1n)
    }
    return pipe(
      fib(n - 1n),
      Ev.chain(prev =>
        pipe(
          fib(n - 2n),
          Ev.map(prev2 => prev2 + prev)
        )
      )
    )
  })
}

function factorial(n: bigint): Ev.Eval<bigint> {
  return Ev.defer(() => {
    if (n <= 0) {
      return Ev.now(1n)
    }
    return pipe(
      factorial(n - 1n),
      Ev.map(next => next * n)
    )
  })
}

// console.log(Ev.unsafeRun(fib(100n)))

console.log(Ev.unsafeRun(factorial(1_000n)))

// pipe(
//   RNEA.range(1, 20),
//   RNEA.map(flow(BigInt, fib, Ev.unsafeRun)),
// )  //?
// (fib(4n)) //?

// Ev.unsafeRun(factorial(12n)) //?
