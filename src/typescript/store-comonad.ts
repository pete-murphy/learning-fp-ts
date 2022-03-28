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
  Store.seeks(incString),
  Store.experiment(RA.Functor)(s => [
    mvString(-2)(s),
    mvString(-1)(s),
    mvString(0)(s),
    mvString(1)(s),
    mvString(2)(s)
  ])
) //?
