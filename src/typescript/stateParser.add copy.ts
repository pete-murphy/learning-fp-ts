import { flow, tuple, pipe } from "fp-ts/lib/function"
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

const inputUncons: (input: Input) => Option<[string, Input]> = input =>
  input.str.length === 0
    ? O.none
    : O.some([input.str[0], { loc: input.loc + 1, str: input.str.slice(1) }])

export const URI = "StateEither"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind3<R, E, A> {
    readonly [URI]: StateEither<R, E, A>
  }
}

type StateEither<I, E, A> = StT.StateT2<E.URI, I, E, A>

const stateEither: Monad3<URI> = {
  URI,
  map: (fa, f) => pipe(fa, StT.map(E.Functor)(f)),
  ap: (fab, fa) => pipe(fab, StT.ap(E.Chain)(fa)),
  chain: (fa, f) => pipe(fa, StT.chain(E.Chain)(f)),
  of: StT.of(E.Pointed),
}
type Parser<A> = StateEither<Input, Error, A>

const charP: (char: string) => Parser<string> = char => input =>
  pipe(
    input,
    inputUncons,
    O.fold(
      () => E.left(Error(`Expected '${char}', but reached end of input`)),
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
      () => E.left(Error(`Expected '${str}', but found '${input.str}'`)),
      ([chars, input_]) => E.right([chars.join(""), input_])
    )
  )
