import { pipe, RR, St, tuple } from "./lib/fp-ts-imports"

const x: RR.ReadonlyRecord<
  string,
  ReadonlyArray<string>
> = {
  foo: ["bar", "baz"],
  quux: ["zot"],
  zim: ["hnsodf", "sdfdsf"]
}

pipe(
  x,
  RR.traverse(St.Applicative)(strs => (n: number) => [
    strs.map((str, i) => [str, i + n]),
    n + strs.length
  ]),
  St.evaluate(0)
) //?
