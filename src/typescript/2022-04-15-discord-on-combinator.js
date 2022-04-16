import * as IO from "fp-ts/IO"
import * as DateFns from "date-fns/fp"
import * as Dt from "fp-ts/Date"
import * as N from "fp-ts/number"
import { flow, pipe } from "fp-ts/function"

// const on = <A,C>(f: (_:A) => C) => <B>(g: , a, b) => f(g(a), g(b)))
import { curry, flip } from "ramda"

const on = curry((f, g, a, b) => f(g(a), g(b)))

const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
const comparing = f => on(compare, f)

const seinfeldCharacters = [
  { name: "Newman", episodes: 48 },
  { name: "Ruthie Cohen", episodes: 101 },
  { name: "Kenny Bania", episodes: 7 },
  { name: "George Steinbrenner", episodes: 16 },
  { name: "Susan Ross", episodes: 29 }
]

seinfeldCharacters.sort(comparing(_ => _.name))
// [ { name: 'George Steinbrenner', episodes: 16 },
//   { name: 'Kenny Bania', episodes: 7 },
//   { name: 'Newman', episodes: 48 },
//   { name: 'Ruthie Cohen', episodes: 101 },
//   { name: 'Susan Ross', episodes: 29 } ]

seinfeldCharacters.sort(comparing(_ => _.name.length))
// [ { name: 'Newman', episodes: 48 },
//   { name: 'Susan Ross', episodes: 29 },
//   { name: 'Kenny Bania', episodes: 7 },
//   { name: 'Ruthie Cohen', episodes: 101 },
//   { name: 'George Steinbrenner', episodes: 16 } ]

seinfeldCharacters.sort(flip(comparing(_ => _.episodes)))
// [ { name: 'Ruthie Cohen', episodes: 101 },
//   { name: 'Newman', episodes: 48 },
//   { name: 'Susan Ross', episodes: 29 },
//   { name: 'George Steinbrenner', episodes: 16 },
//   { name: 'Kenny Bania', episodes: 7 } ]

const eq = (a, b) => a === b
const includes = (a, b) => b.includes(a)
const toLower = x => x.toLowerCase()

const eqBy = on(eq)
const includesInsensitive = on(includes, toLower)
