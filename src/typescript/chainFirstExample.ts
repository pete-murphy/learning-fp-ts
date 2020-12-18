import { pipe } from "fp-ts/lib/function"
import * as TE from "fp-ts/lib/TaskEither"

const getSomeValue = () => TE.of(0)
const doSomeEffect = (n: number) =>
  TE.fromIO(() => {
    console.log("Here", n)
    return n + 1
  })
const doSomeEffect2 = (n: number) =>
  TE.fromIO(() => {
    console.log("Here", n)
    return n + 1
  })

// const foo = pipe(
//   TE.Do,
//   TE.bind('someVal', getSomeValue),
//   TE.chain(({someVal}) => doSomeEffect(someVal)),
//   TE.chain(({someVal}) => doSomeEffect2(someVal))
// )

const foo_ = pipe(
  getSomeValue(),
  TE.chainFirst(doSomeEffect),
  TE.chainFirst(doSomeEffect2)
)

foo_().then(console.log)
