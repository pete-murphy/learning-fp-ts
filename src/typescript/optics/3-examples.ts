import * as L from "monocle-ts"

// const _1 = <S, I, A>() => new L.At<S, I, A>(i => L.Lens.fromPath<S>()(i))
const _1 = <A>() => L.Lens.fromProp<Array<A>>()(1)
const _2 = <A>() => L.Lens.fromProp<Array<A>>()(2)

_1<number>().get([1, 2, 3]) //?

_1()
  .compose(_2())
  .get([1, ["a", "b", "c"]]) //?
