import { getSemiring, ap, alt, of } from "./freeSemiring"
import { Option, some, none } from "fp-ts/lib/Option"

const { add, zero, mul, one } = getSemiring<string>()

mul(one, one) //-> one
mul(zero, one) //-> zero
add(zero, zero) //-> zero
add(one, zero) //-> one

const x = [["x"]]
const y = [["y"]]
const z = [["z"]]

mul(add(x, y), z)
//-> [["x", "z"], ["y", "z"]]
add(mul(x, z), mul(y, z))
//-> [["x", "z"], ["y", "z"]]

const hasSpecialChar = (str: string): Option<string> =>
  str.includes("$") ? some(str) : none
const isLongEnough = (str: string): Option<string> =>
  str.length > 5 ? some(str) : none

// Not sure how this is useful yet
ap(
  alt(of(hasSpecialChar), () => of(isLongEnough)),
  [["foo", "fooooooood", "FOOOOOOOOOOD$$$$"]]
) //?
