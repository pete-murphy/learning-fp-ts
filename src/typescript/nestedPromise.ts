import { pipe } from "fp-ts/lib/pipeable"
// let nestedPromise = Js.Promise.resolve(1);

import * as T from "fp-ts/lib/Task"

// Js.Promise.resolve(nestedPromise)
// ->Js.Promise.then_(p => /* ... */)

const nestedPromise = Promise.resolve(1)
Promise.resolve(nestedPromise).then(p => p.then(n => n + 1))

const nestedTask = T.of(1)
pipe(T.of(nestedTask), T.map(T.map(n => n + 1)))
