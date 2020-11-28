import { contramap, Ord, ordNumber } from "fp-ts/lib/Ord"

const exhaustiveTuple = <A extends string>() => <List extends Array<A>>(
  ...x: List & ([A] extends [List[number]] ? List : never)
) => x

// const ordFromTuple = <A extends string>(xs: A) =>
//   pipe(xs, exhaustiveTuple<A>(), xs_ =>
//     contramap((x: A) => xs_.indexOf(x))(ordNumber)
//   )

function getOrdFromTuple<A extends string>() {
  return <List extends Array<A>>(
    ...xs: List & ([A] extends [List[number]] ? List : never)
  ): Ord<A> => contramap((x: A) => xs.indexOf(x))(ordNumber)
}

// This works for literal string unions, doesn't seem to play nice with
// `io-ts` codec-derived types though

type Foo = "A" | "ZZZ" | "D"

const O: Ord<Foo> = getOrdFromTuple<Foo>()("A", "D", "ZZZ")

// Not the best error message though
const O_: Ord<Foo> = getOrdFromTuple<Foo>()("A")
