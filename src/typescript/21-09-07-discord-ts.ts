import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as RA from "fp-ts/ReadonlyArray"
import * as O from "fp-ts/Option"
import * as Re from "fp-ts/Reader"
import { pipe, tupled, untupled } from "fp-ts/function"
import { sequenceS, sequenceT } from "fp-ts/lib/Apply"
import { RD } from "./ssstuff/fp-ts-imports"

const testArray: RNEA.ReadonlyNonEmptyArray<string> = [
  "someKey",
  "1"
]

const fromStringToInt = O.chain(
  (str: string): O.Option<number> => {
    const parsedNumber = parseInt(str)
    if (parsedNumber === NaN) return O.none
    return O.some(parsedNumber)
  }
)

const keyElem = (
  arr: RNEA.ReadonlyNonEmptyArray<string>
): O.Option<string> => RA.lookup(0)(arr)
const groupElem = (
  arr: RNEA.ReadonlyNonEmptyArray<string>
): O.Option<number> =>
  pipe(arr, RA.lookup(1), fromStringToInt)

const firstEffectful = keyElem(testArray)
const secondEffectful = groupElem(testArray)

const makeTuple =
  (n: number) =>
  (s: string): [number, string] =>
    [n, s]

const rez1 = pipe(
  O.of(makeTuple),
  O.ap(secondEffectful),
  O.ap(firstEffectful)
)

const foo = pipe(
  RD.success(
    (x: number) => (y: number) => (z: number) => x * y + z
  ),
  RD.ap(RD.success(1)),
  RD.ap(RD.success(2)),
  RD.ap(RD.success(3))
)

foo

// const rez2 = sequenceT(O.Applicative)(secondEffectful, firstEffectful)
const rez3 = pipe(
  { groupElem, keyElem },
  sequenceS(Re.Apply),
  f => f(testArray),
  sequenceS(O.Apply)
)

const rez = pipe(
  sequenceT(Re.Apply)(groupElem, keyElem),
  f => f(testArray),
  tupled(sequenceT(O.Apply))
)
