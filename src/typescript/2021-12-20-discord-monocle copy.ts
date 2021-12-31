import { Applicative } from "fp-ts/Applicative"
import { HKT } from "fp-ts/HKT"
import * as RA from "fp-ts/ReadonlyArray"
import { pipe } from "fp-ts/function"
import * as T from "monocle-ts/Traversal"
import * as O from "fp-ts/Option"

interface A {
  value: string
}
interface B {
  list: Array<{ value: string }>
}
interface C {
  somethingElse: number
}
type ABC = A | B | C

declare const abc: ABC

function isA(abc: ABC): abc is A {
  return "value" in abc
}
function isB(abc: ABC): abc is B {
  return "list" in abc
}

pipe(abc, O.fromPredicate(isA), x => x)

const both = <S1, S2, A>(
  t1: T.Traversal<S1, A>,
  t2: T.Traversal<S2, A>
): T.Traversal<S1 | S2, A> => ({
  modifyF:
    <F>(F: Applicative<F>) =>
    (f: (a: A) => HKT<F, A>) =>
    (s: S1 | S2) => {
      const fs1 = t1.modifyF(F)(f)(s as S1)
      const fs2 = t2.modifyF(F)(f)(s as S2)
      return F.ap(
        F.map(fs1, s1 => (s2: S2) => s1 === s ? s2 : s1),
        fs2
      )
    },
})

const resultA: T.Traversal<ABC, string> = pipe(
  T.id<ABC>(),
  T.filter(isA),
  T.prop("value")
)

const resultB: T.Traversal<ABC, string> = pipe(
  T.id<ABC>(),
  T.filter(isB),
  T.prop("list"),
  T.traverse(RA.Traversable),
  T.prop("value")
)

const result = both(resultA, resultB)

const exampleA = { value: "foo" }
const exampleB = {
  list: [{ value: "bar" }, { value: "baz" }],
}

const x1 = pipe(result, T.getAll(exampleA))
const y1 = pipe(result, T.getAll(exampleB))

console.log(x1) // [ 'foo' ]
console.log(y1) // [ 'bar', 'baz' ]

const x2 = pipe(
  result,
  T.modify(x => x.toUpperCase())
)(exampleA)
const y2 = pipe(
  result,
  T.modify(x => x.toUpperCase())
)(exampleB)

console.log(x2) // { value: 'FOO' }
console.log(y2) // { list: [ { value: 'BAR' }, { value: 'BAZ' } ] }
