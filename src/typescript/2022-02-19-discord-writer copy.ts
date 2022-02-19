import * as W from "fp-ts/Writer"
import * as F from "fp-ts/function"
import { Monoid as StrMonoid } from "fp-ts/string"
import { pipeable } from "fp-ts/pipeable"

const instance = W.getMonad(StrMonoid)
const { chain } = pipeable(instance)

const add =
  (a: number) =>
  (b: number): number =>
    a + b
const multiply =
  (a: number) =>
  (b: number): number =>
    a * b

const add2 = add(2)
const add2AndLog = (x: number) =>
  F.pipe(
    instance.of(add2(x)),
    W.censor(z => z + `Added 2 to ${x}`)
  )

const multiplyBy2 = multiply(2)
const multiplyBy2AndLog = (x: number) =>
  F.pipe(
    instance.of(multiplyBy2(2)),
    W.censor(() => `Multiplied ${x} by 2`)
  )

const all = F.flow(add2AndLog, chain(multiplyBy2AndLog))

all(2)() //?
