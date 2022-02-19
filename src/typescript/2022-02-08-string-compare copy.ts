import { pipe, RA, Str } from "./ssstuff/fp-ts-imports"

const words = ["a", "a", "A", "AA", "apple", "Apple"]

const x0 = pipe(words, RA.sort(Str.Ord))
const x1 = pipe(words, RA.sort(Str.Ord))

console.log({ x0 })
