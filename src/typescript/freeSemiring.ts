import { Applicative1, getApplicativeComposition } from "fp-ts/lib/Applicative"
import { array } from "fp-ts/lib/Array"
import { Semiring } from "fp-ts/lib/Semiring"
import { Alternative1 } from "fp-ts/lib/Alternative"

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
export const { alt, zero } = array

export const free: Applicative1<URI> & Alternative1<URI> = {
  URI,
  alt,
  ap,
  map,
  of,
  zero,
}
