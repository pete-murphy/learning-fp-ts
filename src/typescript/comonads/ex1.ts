import { Störe, extend, store } from "./Störe"
import { pipe } from "fp-ts/lib/pipeable"
import { identity } from "fp-ts/lib/function"

const App: Störe<string, string> = {
  state: "Pete",
  render: name => `Hello, ${name}!`,
}

const updateState = <E, A>(str: Störe<E, A>, state: E) =>
  pipe(str, extend(identity), s => s.render(state))
