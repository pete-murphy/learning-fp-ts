import * as L from "fp-ts-foldl"
import Immutable from "immutable"
import { readonlyArray as RA, readonlyNonEmptyArray as RNEA } from "fp-ts"
import { pipe } from "fp-ts/function"
import * as t from "transducers-js"

const inc = (n: number) => n + 1
const isEven = (n: number) => n % 2 === 0
const sum = (a: number, b: number) => a + b

const immutableList = () => {
  let largeVector = Immutable.List<number>()

  for (let i = 0; i < 1_000_000; i++) {
    largeVector = largeVector.push(i)
  }

  console.time("builtin")
  const x0 = largeVector.map(inc).filter(isEven).reduce(sum)
  console.assert(x0 === 250000500000)
  console.timeEnd("builtin")

  console.time("foldl")
  const x1 = pipe(
    largeVector,
    pipe(
      L.sum,
      L.prefilter(isEven),
      L.premap(inc),
      L.reduce((fa, b, f) => (fa as Immutable.List<number>).reduce(f, b))
    )
  )
  console.assert(x1 === 250000500000)
  console.timeEnd("foldl")

  console.time("transducers")
  const x2 = t.transduce(
    t.comp(t.map(inc), t.filter(isEven)),
    sum,
    0,
    largeVector
  )
  console.assert(x2 === 250000500000)
  console.timeEnd("transducers")
}

const readonlyArray = () => {
  const largeArray = RNEA.range(0, 1_000_000)

  console.time("builtin")
  const x0 = largeArray.map(inc).filter(isEven).reduce(sum)
  console.assert(x0 === 250000500000)
  console.timeEnd("builtin")

  console.time("foldl")
  const x1 = pipe(
    largeArray,
    pipe(L.sum, L.prefilter(isEven), L.premap(inc), L.fold(RA.Foldable))
  )
  console.assert(x1 === 250000500000)
  console.timeEnd("foldl")

  console.time("transducers")
  const x2 = t.transduce(
    t.comp(t.map(inc), t.filter(isEven)),
    sum,
    0,
    largeArray
  )
  console.assert(x2 === 250000500000)
  console.timeEnd("transducers")
}

const main = () => {
  immutableList()
  // builtin:     180.666ms
  // foldl:       57.848ms
  // transducers: 62.74ms

  readonlyArray()
  // builtin:     53.036ms
  // foldl:       19.376ms
  // transducers: 37.001ms
}

main()
