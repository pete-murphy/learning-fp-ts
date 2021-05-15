// how do I combine TE.TaskEither<"foo", Task<"bar" | "baz">> into
// TE.TaskEither<"foo", "bar" | "baz">

import * as TE from "fp-ts/TaskEither"
import * as T from "fp-ts/Task"
import TaskEither = TE.TaskEither
import Task = T.Task
import { pipe } from "fp-ts/function"

const te1: TaskEither<"foo", Task<"bar" | "baz">> = TE.left("foo")
const te2: TaskEither<"foo", Task<"bar" | "baz">> = TE.right(T.of("bar"))
const te3: TaskEither<"foo", Task<"bar" | "baz">> = TE.right(T.of("baz"))
const te4: TaskEither<"foo", Task<"bar" | "baz">> = TE.right(() =>
  Promise.reject("sxx")
)

const x1: TaskEither<"foo", "bar" | "baz"> = pipe(
  te1,
  TE.chain(t => TE.tryCatch(t, () => "foo"))
)
const x2: TaskEither<"foo", "bar" | "baz"> = pipe(
  te2,
  TE.chain(t => TE.tryCatch(t, () => "foo"))
)
const x3: TaskEither<"foo", "bar" | "baz"> = pipe(
  te3,
  TE.chain(t => TE.tryCatch(t, () => "foo"))
)
const x4: TaskEither<"foo", "bar" | "baz"> = pipe(
  te4,
  TE.chain(t => TE.tryCatch(t, () => "foo"))
)

x1() //?
x2() //?
x3() //?
x4() //?
