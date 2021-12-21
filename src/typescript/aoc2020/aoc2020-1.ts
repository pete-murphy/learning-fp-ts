import fs from "fs"
import { flow, pipe, not } from "fp-ts/function"
import * as Str from "fp-ts/string"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import * as RA from "fp-ts/ReadonlyArray"
import * as D from "io-ts/Decoder"

const lines = (str: string): ReadonlyArray<string> => str.split("\n")

const parseNumber = (str: string): E.Either<Error, number> =>
  pipe(parseInt(str), D.number.decode, E.mapLeft(flow(D.draw, Error)))

const tail: <A>(xs: ReadonlyArray<A>) => ReadonlyArray<A> = RA.matchLeft(
  () => [],
  (_, tail) => tail
)
const tails: <A>(xs: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>> =
  flow(RA.duplicate, tail)

const find2020MatchPart1 = (
  xs: ReadonlyArray<number>
): E.Either<Error, number> =>
  pipe(
    RA.Do,
    RA.apS("x", xs),
    RA.apS("ys", tails(tail(xs))),
    RA.bind("y", ({ ys }) => ys),
    RA.findFirstMap(({ x, y }) => (x + y === 2020 ? O.some(x * y) : O.none)),
    E.fromOption(() => Error("No match found"))
  )

const find2020MatchPart2 = (
  xs: ReadonlyArray<number>
): E.Either<Error, number> =>
  pipe(
    RA.Do,
    RA.apS("x", xs),
    RA.apS("ys", tails(tail(xs))),
    RA.bind("y", ({ ys }) => ys),
    RA.bind("zs", ({ ys }) => tails(tail(ys))),
    RA.bind("z", ({ zs }) => zs),
    RA.findFirstMap(({ x, y, z }) =>
      x + y + z === 2020 ? O.some(x * y * z) : O.none
    ),
    E.fromOption(() => Error("No match found"))
  )

const solvePart1 = (str: string) =>
  pipe(
    str,
    lines,
    RA.filter(not(Str.isEmpty)),
    E.traverseArray(parseNumber),
    E.chain(find2020MatchPart1)
  )

const solvePart2 = (str: string) =>
  pipe(
    str,
    lines,
    RA.filter(not(Str.isEmpty)),
    E.traverseArray(parseNumber),
    E.chain(find2020MatchPart2)
  )

export const main = () =>
  fs.readFile("./input.txt", { encoding: "utf-8" }, (_, x) => {
    console.log("Part 1")
    pipe(
      x,
      D.string.decode,
      E.chainW(solvePart1),
      E.fold(console.error, console.log)
    )
    console.log("Part 2")
    pipe(
      x,
      D.string.decode,
      E.chainW(solvePart2),
      E.fold(console.error, console.log)
    )
  })

main()
