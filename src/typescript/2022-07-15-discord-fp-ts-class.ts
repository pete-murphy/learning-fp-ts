import {
  monoid,
  option as O,
  readonlyArray as RA,
  struct
} from "fp-ts"

const monoidInstance = O.getMonoid(
  O.getMonoid(O.getMonoid(RA.getMonoid<number>()))
)
monoidInstance.concat(
  O.some(O.some(O.some([1]))),
  O.some(O.some(O.some([2])))
) //-> O.some(O.some(O.some([1,2])))

monoid.struct()
