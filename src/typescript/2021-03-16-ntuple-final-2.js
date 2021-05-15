const assert = require("assert")

// const mkFns = n => {
//   return Array.from(
//     { length: n },
//     (_, i) =>
//       function fn(x, m = 1, j = 0) {
//         return m === n ? x : y => fn(i === j + 1 ? y : x, m + 1, j + 1)
//       }
//   )
// }

// const fns = mkFns(3)
// fns[0]("a")("b")("c") //-> "a"
// fns[1]("a")("b")("c") //-> "b"
// fns[2]("a")("b")("c") //-> "c"

// const nTuple = n => {
//   const fns = Array.from(
//     { length: n },
//     (_, i) =>
//       function fn(x, m = 1, j = 1) {
//         return m === n ? x : y => fn(i === j ? y : x, m + 1, j + 1)
//       }
//   )
//   const mk = (x, m = n - 1, xs = []) =>
//     !m
//       ? fn => xs.reduceRight((f, y) => f(y), fn)(x)
//       : y => mk(y, m - 1, [x, ...xs])
//   return [mk, ...fns]
// }
const nTuple = n => [
  TupleCtor(n)([]),
  ...Array.from({ length: n }, (it, idx) => values => values[idx]),
]

const TupleCtor = n => values =>
  n === 0
    ? selector => selector(values)
    : value => TupleCtor(n - 1)([...values, value])

const [Pair, fst, snd] = nTuple(2)
const ExamplePair = Pair("x")(2)
assert(ExamplePair(fst) === "x")
assert(ExamplePair(snd) === 2)

const [Person, fstName, lstName, age, country] = nTuple(4)
const Mao = Person("Mao")("Zedong")(42)("China")

assert(Mao(fstName) === "Mao")
assert(Mao(lstName) === "Zedong")
assert(Mao(age) === 42)
assert(Mao(country) === "China")

const Fidel = Person("Fidel")("Castro")(90)("Cuba")
assert(Fidel(fstName) === "Fidel")
assert(Fidel(lstName) === "Castro")
assert(Fidel(age) === 90)
assert(Fidel(country) === "Cuba")
