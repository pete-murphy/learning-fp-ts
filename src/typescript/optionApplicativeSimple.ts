import { ap, map, some } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

const add = (x: number) => (y: number) => x + y

pipe(some(1), map(add), ap(some(10)))

pipe(some(add(1)), ap(some(10)))
