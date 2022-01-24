import { RR, N } from "./ssstuff/fp-ts-imports"

let fn = (n: number): string => n.toString()

fn = n => (n === 0 ? "zero" : fn(n))

// Set<A> === Predicate<A>

const m1 = RR.getMonoid(N.SemigroupSum)
const m2 = RR.getIntersectionSemigroup(N.SemigroupSum)

const r1 = {
  a: 1,
  b: 2,
}

const r2 = {
  b: 3,
  c: 4,
}

console.log(m1.concat(r1, r2))
console.log(m2.concat(r1, r2))

const existingArray1 = [1, 2, 3, 3]
