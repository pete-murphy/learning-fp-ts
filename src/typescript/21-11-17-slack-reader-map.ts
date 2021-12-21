import { Comonad1 } from "fp-ts/lib/Comonad"
import { flow, identity, pipe } from "fp-ts/lib/function"
import { Kind, URIS } from "fp-ts/lib/HKT"
import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Pred from "fp-ts/lib/Predicate"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Str from "fp-ts/lib/string"
import * as Struct from "fp-ts/lib/struct"
import * as Rd from "fp-ts/lib/Reader"

interface ToDoArgs {
  first: string
  second: string
  third: string
}

const toDoArgs =
  (first: string) =>
  (second: string) =>
  (third: string): ToDoArgs => ({
    first,
    second,
    third,
  })

const toDo =
  ({ first, second, third }: ToDoArgs) =>
  (num: number): string =>
    `${first} ${second} ${third} -> ${num.toString()}`

const f = pipe(toDoArgs, Rd.map(Rd.map(Rd.map(toDo))))

f("a")("b")("c")(1) //?
