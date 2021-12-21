import { pipe, RA } from "./ssstuff/fp-ts-imports"

const b = 0
const a = 1

;[a].flatMap(a => [a, b]) //?

pipe(
  [a],
  RA.chain(a => [a, b])
) //?
