import { Applicative1, getApplicativeComposition } from "fp-ts/lib/Applicative"
import { array } from "fp-ts/lib/Array"
import { Semiring } from "fp-ts/lib/Semiring"

export type Free<A> = Array<Array<A>>

export const URI = "Free"
export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    Free: Free<A>
  }
}

export const getSemiring = <A>(): Semiring<Free<A>> => ({
  add: (xss: Free<A>, yss: Free<A>): Free<A> => xss.concat(yss),
  zero: [],
  mul: (xss: Free<A>, yss: Free<A>): Free<A> =>
    xss.flatMap(xs => yss.map(ys => xs.concat(ys))),
  one: [[]],
})

export const { ap, map, of } = getApplicativeComposition(array, array)

export const free: Applicative1<URI> = {
  URI,
  ap,
  map,
  of,
}

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
