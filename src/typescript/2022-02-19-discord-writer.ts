import { flip, flow } from "fp-ts/lib/function"
import { Iso } from "monocle-ts"
import {
  pipe,
  RA,
  Str,
  RTE,
  Re,
  RT,
  TE,
  T,
  constant,
  Mn,
  Apl,
  Ap,
  Sg,
  O
} from "./ssstuff/fp-ts-imports"
import * as W from "fp-ts/Writer"
import * as Ch from "fp-ts/Chain"
// import { pipeable } from "fp-ts/pipeable";

const addLogger =
  (
    a: number,
    b: number
  ): W.Writer<ReadonlyArray<string>, number> =>
  () =>
    [a + b, [`(${a} + ${b})`]]
const mulLogger =
  (
    a: number,
    b: number
  ): W.Writer<ReadonlyArray<string>, number> =>
  () =>
    [a * b, [`(${a} * ${b})`]]

const StringWriter = W.getMonad(RA.getMonoid<string>())

const bind = Ch.bind(StringWriter)
const apS = Ap.apS(StringWriter)
const Do = StringWriter.of({})

pipe(
  Do,
  apS("x", addLogger(1, 2)),
  bind("y", ({ x }) => mulLogger(x, 3)),
  apS("z", addLogger(29, 23))
)() //?
