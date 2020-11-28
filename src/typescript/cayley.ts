import { Endomorphism } from "fp-ts/lib/function"

const fs: Array<Endomorphism<string>> = ["a", "b", "c"].map(
  (x): Endomorphism<string> => y => x.concat(y)
)

fs.map(f => f("foo")) //?

// const xs_ = ["a", "b", "c"].map(x => Endo(y => x.concat(y)))
// // [Endo(y => 'a'.concat(y)), Endo(y => 'b'.concat(y))]

// xs_.map(x => x.run(""))
// // ['a', 'b', 'c']

// (f . g)(x) == f(g(x)) ==
