import { pipe, RR, St, tuple } from "./lib/fp-ts-imports"

const rec = {
  foo: ["bar", "baz"],
  quux: ["zot"],
  zim: ["hnsodf", "sdfdsf"]
}

pipe(
  rec,
  RR.traverse(St.Applicative)(strs => (n: number) => [
    strs.map((str, i) => [str, i + n]),
    n + strs.length
  ]),
  St.evaluate(0)
) //?
