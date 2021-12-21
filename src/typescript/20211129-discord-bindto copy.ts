import { flow } from "fp-ts/lib/function"
import { Do, Option, bind, of, bindTo, apS } from "fp-ts/Option"

type P = {}
declare const doSomethingWithParam: (p: P) => Option<{}>

// const doSomething = flow(
//   (param: P) => of({ something: doSomethingWithParam(param) }),
//   bind("somethingElse", () => "something else")
// )

const doSomething = flow(
  doSomethingWithParam,
  bindTo("something"),
  apS("somethingElse", of("something else"))
)
