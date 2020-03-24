import { effect as T } from "@matechs/effect"

const helloWorld = T.sync(() => {
  // throw "nope"
  console.log("hello world!")
})

// T.runSync(helloWorld)
// T.runToPromise(helloWorld)
// T.runToPromiseExit(helloWorld)

const consoleUri: unique symbol = Symbol()

interface ConsoleEnv {
  [consoleUri]: {
    log: (
      s: string
    ) => T.Effect<unknown, never, void>
  }
}
