import fs from "fs"
import { EOL } from "os"
import * as E from "fp-ts/lib/Either"
import * as A from "fp-ts/lib/Array"
import * as O from "fp-ts/lib/Option"
import { isEmpty } from "fp-ts/lib/string"
import { flow, pipe, not, identity, constant } from "fp-ts/lib/function"
import { split } from "fp-ts-std/String"
import { fromString } from "fp-ts-std/Number"
import { product, sum } from "fp-ts-std/Array"
import { N, RA } from "../ssstuff/fp-ts-imports"

// const always = <A>(a: A) => () => a
const sumIs2020 = flow(sum, n => n === 2020)

const log =
  <A>(id: string) =>
  (a: A): A => {
    console.log(`${id}: ${JSON.stringify(a)}`)
    return a
  }

const parseInput = flow(
  split(EOL),
  A.filter(not(isEmpty)),
  O.traverseArray(fromString),
  O.map(RA.toArray),
  E.fromOption(constant("Error: Something went wrong parsing the input."))
)

// A.map(fromString),
// A.sequence(O.option),

// Returns all possible combinations of an array for a given size
// e.g. combinations(2)([1, 2, 3, 4]) => [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
// e.g. combinations(3)([1, 2, 3, 4]) => [[1, 2, 3], [1, 3, 4], [1, 2, 4], [2, 3, 4]]
const combinations =
  <A>(size: number) =>
  (arr: A[]) => {
    const fn = (size: number, acc: A[][], arr: A[]): A[][] => {
      if (arr.length < size) {
        return acc
      }

      if (size === 1) {
        return arr.map(i => [i])
      }

      const [current, ...others] = arr
      return fn(
        size,
        acc.concat(fn(size - 1, [], others).map(other => [current, ...other])),
        others
      )
    }

    return fn(size, [], arr)
  }

const find2020Match: (a: number[]) => O.Option<number[]> = A.matchLeft(
  constant(O.none),
  (head, tail) =>
    pipe(
      tail,
      A.findFirst(tailItem => sumIs2020([tailItem, head])),
      O.fold(
        () => find2020Match(tail),
        tailItem => O.some([head, tailItem])
      )
    )
)

const readInput = (filename: string): E.Either<string, string> => {
  try {
    return E.right(fs.readFileSync(filename, { encoding: "utf-8" }))
  } catch (err) {
    return E.left("SDf")
  }
}
const solve = (arraySumCombinationSize: number) =>
  flow(
    readInput,
    E.chain(parseInput),
    E.map(
      flow(
        combinations(arraySumCombinationSize),
        A.findFirst(sumIs2020),
        O.fold(() => "none were found", flow(product, N.Show.show))
      )
    ),
    E.fold(identity, s => `The solution is: "${s}".`)
  )

const solvePart1 = solve(2)
const solvePart2 = solve(3)

console.log(`Part 1: ${solvePart1("day01.txt")}`)
console.log(`Part 2: ${solvePart2("day01.txt")}`)
