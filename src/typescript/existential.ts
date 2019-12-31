type StackOps<S, A> = {
  init(): S
  push(s: S, x: A): void
  pop(s: S): A
  size(s: S): number
}

type Stack<A> = <R>(go: <S>(ops: StackOps<S, A>) => R) => R

const arrayStack = <A>(): Stack<A> => go =>
  go<A[]>({
    init: () => [],
    push: (s, x) => s.push(x),
    pop: s => {
      if (s.length) return s.pop()!
      else throw Error("empty stack!")
    },
    size: s => s.length,
  })

const doStackStuff = (stack: Stack<string>) =>
  stack(({ init, push, pop, size }) => {
    const s = init()
    push(s, "hello")
    push(s, "world")
    push(s, "omg")
    pop(s)
    return size(s)
  })

doStackStuff(arrayStack())
