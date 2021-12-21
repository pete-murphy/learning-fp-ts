import { Ap, pipe, RT, RTE, T } from "./ssstuff/fp-ts-imports"

// type C = string
// type E = string
// declare function f(): RTE.ReaderTaskEither<C, E, number>
// declare function g(a: number): RTE.ReaderTaskEither<C, E, number>

// const h = pipe(
//   RTE.Do,
//   RTE.apS("a", f()),
//   RTE.apS("c", RTE.ask()),
//   RTE.chain(({ a, c }) => g(a))
// )

// const h_ = pipe(
//   Ap.sequenceT(RTE.ApplyPar)(f(), RTE.ask<C>()),
//   RTE.chain(([a, c]) => g(a))
// )

const apSEffect = Ap.apS(RTE.getReaderTaskValidation<SomeErrorType>(. . .))

declare const someRTE: RTE.ReaderTaskEither<R, SomeErrorType, A>
declare const finallyRTE: RTE.ReaderTaskEither<R, void, void>

pipe(
  RTE.Do,
  RTE.apS('effect1', someRTE),
  RTE.apS('effect2', finallyRTE)
) // -> RTE.ReaderTaskEither<R, SomeErrorType, { effect1: A, effect2: void }>

const x = RTE.fromTask(T.delay(1000)(T.of("x")))
const y = RTE.fromTask(T.delay(1000)(T.of("a")))
const yb = pipe(
  RTE.fromTask(T.delay(1000)(T.of("a"))),
  RTE.chainW(() => RTE.left(9))
)

const main1 = () => {
  console.time("a")
  pipe(x, RTE.apFirst(y))({})().then(() => console.timeEnd("a"))
}
const main2 = () => {
  console.time("b")
  pipe(
    x,
    RTE.chainFirst(() => y),
    RT.chainFirst(() =>
      RTE.fromIO(() => {
        console.log("Hey")
      })
    )
  )({})().then(() => console.timeEnd("b"))
}

const main2b = () => {
  console.time("c")
  pipe(
    x,
    RTE.chainFirst(() => y),
    RT.chainFirst(() =>
      RT.fromIO(() => {
        console.log("Hey")
      })
    )
  )({})().then(() => console.timeEnd("c"))
}
// main1()
main2()
main2b()