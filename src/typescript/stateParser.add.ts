import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"
import { flow, tuple } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import Option = O.Option
import * as E from "fp-ts/lib/Either"
import * as Tu from "fp-ts/lib/Tuple"
import * as StT from "fp-ts/lib/StateT"
import { Monad3 } from "fp-ts/lib/Monad"
import { Alt3 } from "fp-ts/lib/Alt"

type Expr =
  | { tag: "Add"; contents: [Expr, Expr] }
  | { tag: "Num"; contents: number }

type Input = {
  loc: number
  str: string
}

const inputUncons: (
  input: Input
) => Option<[string, Input]> = input =>
  input.str.length === 0
    ? O.none
    : O.some([
        input.str[0],
        { loc: input.loc + 1, str: input.str.slice(1) },
      ])

declare module "fp-ts/lib/HKT" {
  interface URItoKind3<R, E, A> {
    readonly StateEither: StateEither<R, E, A>
  }
}

export const URI = "StateEither"

export type URI = typeof URI

type StateEither<I, E, A> = StT.StateT2<E.URI, I, E, A>

const stateEither: Monad3<URI> & Alt3<URI> = {
  URI,
  ...StT.getStateM(E.either),
  alt: (fa, that) => input =>
    pipe(
      fa(input),
      E.fold(
        () => that()(input),
        x => E.right(x)
      )
    ),
}

type Parser<A> = StateEither<Input, Error, A>

const charP: (char: string) => Parser<string> = char => input =>
  pipe(
    input,
    inputUncons,
    O.fold(
      () =>
        E.left(Error(`Expected '${char}', but reached end of input`)),
      ([y, ys]) =>
        char === y
          ? E.right(tuple(char, ys))
          : E.left(Error(`Expected '${char}', but found '${y}'`))
    )
  )

const stringP: (str: string) => Parser<string> = str => input =>
  pipe(
    input,
    pipe([...str], A.traverse(stateEither)(charP)),
    E.fold(
      () =>
        E.left(Error(`Expected '${str}', but found '${input.str}'`)),
      ([chars, input_]) => E.right([chars.join(""), input_])
    )
  )
