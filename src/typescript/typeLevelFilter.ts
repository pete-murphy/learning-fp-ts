import * as t from "io-ts"
import { rights } from "fp-ts/lib/Array"

const Foo = t.type({
  a: t.number,
  b: t.number,
  c: t.number,
  d: t.number,
})

const arrayOfPartials = [
  { a: 0, b: 9, c: 0, d: 99 },
  { a: 0 },
  { b: 1, c: 2, d: 3 },
  { a: 101, b: 200, d: 239 },
  { a: 9, b: 99, c: 100, d: 99 },
  { a: 9, b: 99, c: 100 },
]

const filtered = rights(arrayOfPartials.map(Foo.decode)) //?
