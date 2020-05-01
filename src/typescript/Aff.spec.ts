import { of, fromIO, chain } from "./Aff"
import { pipe } from "fp-ts/lib/pipeable"

function getLoggers(logs: Array<string | number>) {
  const log = (s: string | number) => () => {
    logs.push(s)
  }
  const error = (e: Error) => log(e.message)
  return { log, error }
}

describe("Aff", () => {
  it("of", () => {
    const logs: Array<string | number> = []
    const { log, error } = getLoggers(logs)
    const aio = of("a")
    aio(error, log)
    expect(logs).toEqual(["a"])
  })

  it("chain", () => {
    const logs: Array<string | number> = []
    const { log, error } = getLoggers(logs)
    const aio1 = pipe(
      of("a"),
      chain(() => of(1))
    )
    aio1(error, log)
    expect(logs).toEqual([1])

    let counter = 0
    const aio2 = fromIO(() => {
      counter += 1
      return "a"
    })
    const aio3 = fromIO(() => {
      counter += 1
      return "b"
    })
    const aio4 = pipe(
      aio2,
      chain(() => aio3)
    )
    aio4(error, log)
    expect(counter).toEqual(2)
    expect(logs).toEqual([1, "b"])
  })

  it("fromIO", () => {
    let counter = 0
    const logs: Array<string | number> = []
    const { log, error } = getLoggers(logs)

    const aio1 = fromIO(() => {
      counter += 1
      return "a"
    })

    expect(counter).toEqual(0)
    expect(logs).toEqual([])

    aio1(error, log)

    expect(counter).toEqual(1)
    expect(logs).toEqual(["a"])

    const aio2 = fromIO(() => {
      throw new Error("ouch")
    })

    aio2(error, log)

    expect(counter).toEqual(1)
    expect(logs).toEqual(["a", "ouch"])
  })
})
