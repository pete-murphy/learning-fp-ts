// data List a = List (forall b. (a -> b -> b) -> b -> b)

type List_<A, X> = (cons: (a: A, x: X) => X) => (x: X) => X

type List<A> = <R>(run: <X>(_: List_<A, X>) => R) => R

const map =
  <A, B>(f: (a: A) => B) =>
  (as: List<A>): List<B> =>
  run =>
    as(as_ =>
      run<X>(
        cons => (x: X) =>
          // as_((a, x_: X): X => cons(f(a), x_))(x)
          as_((a, x_: any): any => cons(f(a), x_))(x as any)
      )
    )

const Nil =
  <A>(): List<A> =>
  run =>
    run<X>(_cons => x => x)

const Cons =
  <A>(a: A, as: List<A>): List<A> =>
  run =>
    as(as_ =>
      run<X>(
        cons => (x: X) =>
          // as_(cons)(cons(a, x))
          as_(cons as any)(cons(a, x) as any)
      )
    )

const toArray = <A>(as: List<A>): Array<A> =>
  // as((run: List_<A, A[]>) => run((a, b) => b.concat(a))([]))
  as((run: any) => run((a: any, b: any) => b.concat(a))([]))

const myList = Cons(1, Cons(2, Cons(3, Cons(4, Nil()))))

toArray(myList) //?

toArray(map((x: number) => x + 1)(myList)) //?
