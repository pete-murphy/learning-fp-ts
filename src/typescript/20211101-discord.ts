import * as A from "fp-ts/Array"
import * as RA from "fp-ts/ReadonlyArray"
import * as E from "fp-ts/Either"
import { flow, pipe, tuple } from "fp-ts/function"
import * as t from "io-ts"

// I'm trying to generate every possible object, from a list of possible keys.

const COLORS = ["red", "blue"] as const
const THINGS = ["ball", "box"] as const

interface ColoredThing {
  color: typeof COLORS[number]
  thing: typeof THINGS[number]
}

const ALL_POSSIBLE_COLORED_THINGS: ReadonlyArray<ColoredThing> = pipe(
  RA.Do,
  RA.apS("color", COLORS),
  RA.apS("thing", THINGS)
)

console.log(ALL_POSSIBLE_COLORED_THINGS)

// const ALL_POSSIBLE_COLORED_THINGS = pipe(
//   // What would go here to calculate this instead of hardcoding?
//   { color: 'red', thing: 'ball', },
//   { color: 'red', thing: 'box', },
//   { color: 'blue', thing: 'ball', },
//   { color: 'blue', thing: 'box', },
// );
