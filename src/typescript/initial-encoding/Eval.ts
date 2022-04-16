import { pipe } from "fp-ts/function"

export const enum EvalTag {
  Now,
  Chain,
  Defer
}

// export abstract class Eval<A> {}
export type Eval<A> = Now<A> | Chain<unknown, A> | Defer<A>
type Now<A> = {
  readonly _tag: EvalTag.Now
  readonly value: A
}
export const now = <A>(value: A): Eval<A> => ({
  _tag: EvalTag.Now,
  value
})

type Chain<B, A> = {
  readonly _tag: EvalTag.Chain
  readonly self: Eval<B>
  readonly f: (a: B) => Eval<A>
}
export const chain =
  <B, A>(f: (a: B) => Eval<A>) =>
  (self: Eval<B>): Eval<A> =>
    ({
      _tag: EvalTag.Chain,
      self,
      f
    } as Eval<A>)

type Defer<A> = {
  readonly _tag: EvalTag.Defer
  readonly make: () => Eval<A>
}
export const defer = <A>(make: () => Eval<A>): Eval<A> => ({
  _tag: EvalTag.Defer,
  make
})

type Concrete =
  | Now<unknown>
  | Chain<unknown, unknown>
  | Defer<unknown>

function concrete(e: Eval<unknown>): Concrete {
  return e as unknown as Concrete
}

// -----------------------------------------------------

export function map<A, B>(f: (a: A) => B) {
  return (fa: Eval<A>) =>
    pipe(
      fa,
      chain(a => now(f(a)))
    )
}

// -----------------------------------------------------

class ContinuationFrame {
  constructor(
    readonly apply: (a: unknown) => Eval<unknown>
  ) {}
}

export function unsafeRun<A>(e: Eval<A>): A {
  let stack: Array<ContinuationFrame> = []
  let current: Concrete | undefined = concrete(e)
  let value: unknown = null

  while (current) {
    switch (current._tag) {
      case EvalTag.Chain: {
        stack.push(new ContinuationFrame(current.f))
        current = concrete(current.self)
        break
      }
      case EvalTag.Defer: {
        current = concrete(current.make())
        break
      }
      case EvalTag.Now: {
        value = current.value
        if (stack.length) {
          const frame: ContinuationFrame = stack[0]
          stack = stack.slice(1)
          current = concrete(frame.apply(value))
        } else {
          current = undefined
        }
        break
      }
    }
  }
  return value as A
}
