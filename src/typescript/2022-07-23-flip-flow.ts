import * as f from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import Option = O.Option
import * as E from "fp-ts/lib/Either"
import * as Tu from "fp-ts/lib/Tuple"
import * as RT from "fp-ts/lib/ReaderT"
import * as StT from "fp-ts/lib/StateT"
import { Monad3 } from "fp-ts/lib/Monad"
import { Alt3 } from "fp-ts/lib/Alt"

export const URI = "ReaderOption"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind3C<S, R, E, A> {
    readonly [URI]: StT.StateT<E.URI, E, A>
  }
}

// (a, b) => c => a(b(c))
const b = (n: number) => n + 1
const a = (n: number) => n.toString()
f.flow(b, a)(0)

export function flow<A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (a: A) => C {
  return a => bc(ab(a))
}

flow(a, b)(0)
