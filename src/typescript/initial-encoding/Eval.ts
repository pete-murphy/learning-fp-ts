import { pipe } from "fp-ts/function"

export const enum EvalTag {
  Now,
  Chain,
  Defer
}

export abstract class Eval<A> {
  readonly _A!: () => A
}

class Now<A> extends Eval<A> {
  readonly _tag = EvalTag.Now
  constructor(readonly value: A) {
    super()
  }
}

class Chain<A, B> extends Eval<B> {
  readonly _tag = EvalTag.Chain
  constructor(
    readonly self: Eval<A>,
    readonly f: (a: A) => Eval<B>
  ) {
    super()
  }
}

class Defer<A> extends Eval<A> {
  readonly _tag = EvalTag.Defer
  constructor(readonly make: () => Eval<A>) {
    super()
  }
}

type Concrete =
  | Now<unknown>
  | Chain<unknown, unknown>
  | Defer<unknown>

function concrete(e: Eval<unknown>): Concrete {
  return e as unknown as Concrete
}

// -----------------------------------------------------

export function now<A>(a: A): Eval<A> {
  return new Now(a)
}

export function chain<A, B>(f: (a: A) => Eval<B>) {
  return (ma: Eval<A>) => new Chain(ma, f)
}

export function defer<A>(make: () => Eval<A>): Eval<A> {
  return new Defer(make)
}

export function map<A, B>(f: (a: A) => B) {
  return (fa: Eval<A>) =>
    pipe(
      fa,
      chain(a => now(f(a)))
    )
}

// -----------------------------------------------------

interface Stack<A> {
  value: A
  previous?: Stack<A>
}

function mkStack<A>(
  value: A,
  previous?: Stack<A>
): Stack<A> {
  return { value, previous }
}

class ContinuationFrame {
  constructor(
    readonly apply: (a: unknown) => Eval<unknown>
  ) {}
}

export function unsafeRun<A>(e: Eval<A>): A {
  let stack: Stack<ContinuationFrame> | undefined =
    undefined
  let current: Concrete | undefined = concrete(e)
  let value: unknown = null

  while (current) {
    switch (current._tag) {
      case EvalTag.Chain: {
        stack = mkStack(
          new ContinuationFrame(current.f),
          stack
        )
        current = concrete(current.self)
        break
      }
      case EvalTag.Defer: {
        current = concrete(current.make())
        break
      }
      case EvalTag.Now: {
        value = current.value
        if (stack) {
          const frame: ContinuationFrame = stack.value
          stack = stack.previous
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
