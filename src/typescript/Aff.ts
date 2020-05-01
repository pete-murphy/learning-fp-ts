import { Monad1 } from "fp-ts/lib/Monad"
import { IO } from "fp-ts/lib/IO"
import { constant, identity } from "fp-ts/lib/function"
import { pipeable, pipe } from "fp-ts/lib/pipeable"
import { MonadTask1 } from "fp-ts/lib/MonadTask"
import { tryCatch, fold } from "fp-ts/lib/Either"

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    readonly Aff: Aff<A>
  }
}

export const URI = "Aff"

export type URI = typeof URI

/**
 * A canceler is an asynchronous function that can be used to attempt the
 * cancelation of a computation. Returns a boolean flag indicating whether
 * or not the cancellation was successful. Many computations may be composite,
 * in such cases the flag indicates whether any part of the computation was
 * successfully canceled. The flag should not be used for communication
 */
export type Canceler = (e: Error) => Aff<boolean>

export type ErrorHandler = (e: Error) => IO<void>

export type SuccessHandler<A> = (a: A) => IO<void>

export interface Aff<A> {
  (e: ErrorHandler, s: SuccessHandler<A>): Canceler
}

// A constant canceler that always returns false.
export const nonCanceler: Canceler = constant(of(false))

// A constant canceller that always returns true.
export const alwaysCanceler: Canceler = constant(of(true))

export function of<A>(a: A): Aff<A> {
  return (_, s) => {
    s(a)()
    return nonCanceler
  }
}

export function fromIO<A>(ma: IO<A>) {
  return (e: ErrorHandler, s: SuccessHandler<A>) => {
    pipe(tryCatch(ma, identity), fold(e, s))()
    return nonCanceler
  }
}

function chain_<A, B>(
  ma: Aff<A>,
  amb: (a: A) => Aff<B>
): Aff<B> {
  return (e, s) => {
    let c1: Canceler
    let c2: Canceler
    let isCanceled = false
    let requestCancel = false
    let onCanceler: (canceler: Canceler) => void = () =>
      void 0

    c1 = ma(e, (a) => {
      if (requestCancel) {
        isCanceled = true
      } else {
        c2 = amb(a)(e, s)
        onCanceler(c2)
      }
      return () => undefined
    })

    return (e1): Aff<boolean> => (e2, s) => {
      requestCancel = true
      if (c2 !== undefined) {
        return c2(e1)(e2, s)
      } else {
        return c1(e1)(e2, (b) => {
          if (b || isCanceled) {
            s(true)
          } else {
            onCanceler = (canceler) => canceler(e1)(e2, s)
          }
          return () => undefined
        })
      }
    }
  }
}

export const aff: Monad1<URI> & MonadTask1<URI> = {
  URI,
  map: (ma, f) => (e, s) => ma(e, (a) => s(f(a))),
  of,
  ap: (mab, ma) =>
    chain_(mab, (f) => (e, s) => ma(e, (a) => s(f(a)))), // Derived
  chain: chain_,
  fromIO,
  // Not sure if this works
  fromTask: (ma) => (e, s) => {
    ma().then(s, e)
    return nonCanceler
  },
}

const {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  flatten,
  map,
} = pipeable(aff)

export {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  flatten,
  map,
}
