import { Char, fromString } from "./Char"
import * as O from "fp-ts/lib/Option"
import * as T from "fp-ts/lib/Tuple"
import { pipe } from "fp-ts/lib/pipeable"

import Option = O.Option
import { monoidString, Monoid } from "fp-ts/lib/Monoid"
import { getFirstSemigroup } from "fp-ts/lib/Semigroup"

type Parser<A> = (str: string) => Result<A>
type Result<A> = [Option<A>, string]

const monoidResult: Monoid<Result<string>> = {
  concat: ([x1, x2], [y1, y2]) => {
    T.get
  }
}

type RE = Parser<string>

const isSuccess = <A>(result: Result<A>):boolean =>  O.isSome(result[0])
const canContinue = <A>(result: Result<A>):boolean =>  result[1].length > 0

const parseRE = (pat: string): RE => (str: string) =>
  toPair(str.match(r_(pat)), str)

const toPair = (
  matches: RegExpMatchArray | null,
  input: string
): Result<string> => {
  return pipe(
    matches,
    O.fromNullable,
    O.map(xs => [
      O.some(xs[0]),
      xs.index && xs.input ? xs.input.slice(xs.index) : "",
    ]),
    O.getOrElse(() => [O.none, input])
  )
}

function r_(str: string): RegExp {
  return new RegExp(str)
}

const T_ = T.getApply(getFirstSemigroup<string>())
const char: (c: string) => RE = parseRE
const anyChar: RE = parseRE(".")
const cat: (re1: RE) => (re2: RE) => RE = re1 => re2 => str =>
  T_.ap(
    T_.map(re1(str), (x: Option<string>) => (y: Option<string>) =>
      pipe(
        x,
        O.map((str1: string) => (str2: string) =>
          monoidString.concat(str1, str2)
        ),
        O.ap(y)
      )
    ),
    re2(str)
  )

const optional: (re: RE) => RE = re => parseRE(`${re}?`)
const either: (re1: RE) => (re2: RE) => RE = re1 => re2 => str =>
  re1(str) || re2(str)
// const either: (re1: RE) => (re2: RE) => RE = re1 => re2 =>
//   parseRE(`(${re1})|(${re2})`)
const star: (re: RE) => RE = re => str => {
  const res = re(str)
  if (isSuccess(res) && canContinue(res) {
    []
  }
}
const emptyMatch: RE = parseRE("")
const fail: RE = str => [O.none, str]

// cat(char("a"))(anyChar)("abc") //?
either(anyChar)(anyChar)("abc") //?


// star(char("a"))("abc") //?