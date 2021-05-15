import { flow, pipe } from "fp-ts/function"
import * as Rd from "fp-ts/Reader"
import * as Mn from "fp-ts/Monoid"

const contains = (needle: string) => (
  haystack: string
) => haystack.includes(needle)

// const validate = flow(
//   Rd.sequenceArray([
//     contains("this"),
//     contains("that"),
//     contains("x"),
//   ]),
//   Mn.fold(Mn.monoidAny)
// )

// validate("a string which contains that") //?
// validate(
//   "a string which doesn't contain any words we want"
// ) //?

const validate = pipe(
  [
    contains("this"),
    contains("that"),
    contains("x"),
  ],
  Mn.fold(Rd.getMonoid(Mn.monoidAny))
)

validate("that")
//-> true
validate("taht")
//-> false
