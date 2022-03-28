import {
  IO,
  pipe,
  RA,
  RNEA,
  Sg,
  Str,
  Fld,
  Mn
} from "./lib/fp-ts-imports"
import * as crypto from "crypto"

const charSet32_ = "2346789bdfghjmnpqrtBDFGHJLMNPQRT"
const charSet32 = pipe(charSet32_, Str.split(""))

const randomInRange = (lo: number, hi: number) => () =>
  Math.floor(Math.random() * (hi + 1 - lo)) + lo
export const generateSecret: IO.IO<any> = () => {
  // const randomInts: ReadonlyArray<number> = Array.from(
  //   // window.crypto.getRandomValues(new Uint8Array(16)),

  // )
  const randomInts: RNEA.ReadonlyNonEmptyArray<number> =
    pipe(
      RA.replicate(16, randomInRange(0, 31)),
      IO.sequenceArray
    )() as RNEA.ReadonlyNonEmptyArray<number>

  return pipe(
    randomInts,
    RNEA.map(i => RNEA.lookupMod(i)(charSet32)),
    RNEA.chunksOf(4),
    RNEA.concatAll(
      Sg.intercalate(RNEA.of("-"))(RNEA.getSemigroup())
    ),
    Sg.concatAll(Sg.intercalate("")(Str.Semigroup))("")
  )
}

console.log(generateSecret())
