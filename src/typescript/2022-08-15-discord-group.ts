import { group as G, string as Str } from "fp-ts"
import { pipe } from "fp-ts/function"
import { N, RA, RS as RS_ } from "./lib/fp-ts-imports"

const RS = {
  insert: RS_.insert(N.Eq),
  elem: RS_.elem(N.Eq),
  union: RS_.union(N.Eq),
  difference: RS_.difference(N.Eq),
  intersection: RS_.intersection(N.Eq)
}

type Fn = (_: ReadonlySet<number>) => ReadonlySet<number>
const groupArr: G.Group<Fn> = {
  concat: (f, g) => xs => RS.difference(f(xs), g(xs)),
  empty: xs => xs,
  inverse: f => xs =>
    // // RS.difference(RS.union(f(xs), xs), RS.intersection(f(xs), xs))
    RS.union(RS.difference(xs, f(xs)), RS.difference(f(xs), xs))
}

const { concat, empty, inverse } = groupArr

const x: Fn = RS.insert(1)
const y: Fn = RS.insert(2)

concat(inverse(x), x)(new Set()) //?
concat(inverse(y), y)(new Set()) //?

concat(x, inverse(x))(new Set()) //?

// inverse(
//   concat(
//     str => str + "foo",
//     str => str + "bar"
//   )
// )("") //?

// inverse(
//   concat(
//     str => str + "foo",
//     str => str + "bar"
//   )
// )("foobar") //?
