import { pipe, TE } from "./ssstuff/fp-ts-imports"

const f = TE.tryCatch(
  () => {
    console.log("SHhfdf")
    return Promise.resolve("what")
  },
  () => 9
)

const result: TE.TaskEither<number, string> = pipe(TE.left(42), TE.apFirst(f))
const result2: TE.TaskEither<number, string> = pipe(TE.left(49), TE.apSecond(f))

const resultR: TE.TaskEither<number, string> = pipe(
  TE.right("foo"),
  TE.apFirst(f)
)
const resultR2: TE.TaskEither<number, string> = pipe(
  TE.right("bar"),
  TE.apSecond(f)
)

// result().then(x => {
//   x
//   console.log({ x })
// })

result2().then(x => {
  x
  console.log({ x })
})

resultR().then(x => {
  x
  console.log({ x })
})

resultR2().then(x => {
  x
  console.log({ x })
})
