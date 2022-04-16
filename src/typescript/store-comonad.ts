import { O, pipe, RA, RR, Store } from "./lib/fp-ts-imports"

// const map_ = new Map([
//   ["a", 0],
//   ["b", 1],
//   ["c", 1],
// ])

const record = {
  a: 0,
  b: 1,
  c: 2
}

const store: Store.Store<string, O.Option<number>> = {
  peek: k => pipe(record, RR.lookup(k)),
  pos: "a"
}

const incString = (str: string) =>
  String.fromCharCode(str.charCodeAt(0) + 1)
const decString = (str: string) =>
  String.fromCharCode(str.charCodeAt(0) - 1)

const mvString = (n: number) => (str: string) =>
  String.fromCharCode(str.charCodeAt(0) + n)

pipe(
  store,
  Store.seek("d"),
  Store.seeks(incString), // Focus is now "e"
  Store.seeks(decString), // Focus is now "d"
  Store.seeks(decString),
  Store.seeks(decString), // Focus is now "b"
  Store.experiment(RA.Functor)(s => [
    mvString(-2)(s),
    mvString(-1)(s), // s: "a"
    mvString(0)(s), //  s: "b"
    mvString(1)(s), //  s: "c"
    mvString(2)(s) //   s: "d"
  ])
) //?
