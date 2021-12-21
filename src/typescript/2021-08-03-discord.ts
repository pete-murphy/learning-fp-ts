import { flow, O, RA as A } from "./ssstuff/fp-ts-imports"

const f = flow(A.of, A.head)

const f_ = flow(a => [a], A.head)

const f__ = flow(
  a => [a],
  as => (A.isEmpty(as) ? O.none : O.some(as[0]))
)

const f___ = flow(a => (A.isEmpty([a]) ? O.none : O.some(a)))

const f____ = flow(a => O.some(a))
