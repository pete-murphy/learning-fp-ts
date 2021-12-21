import { Option } from "fp-ts/lib/Option"
import { Task } from "fp-ts/lib/Task"
import { O, pipe, RA, T } from "./ssstuff/fp-ts-imports"

// RA.unfold

const unfoldTask = <A, B>(
  b: B,
  f: (b: B) => Task<Option<readonly [A, B]>>
): Task<readonly A[]> =>
  pipe(
    f(b),
    T.chain(
      O.fold(
        () => T.of<readonly A[]>([]),
        ([a, b]) => pipe(unfoldTask(b, f), T.map(RA.prepend(a)))
      )
    )
  )

const z = unfoldTask(90, n =>
  pipe(
    T.delay(100)(
      T.of(n > 56 ? O.some([String.fromCharCode(n), n - 1]) : O.none)
    )
  )
)

const main = () => {
  console.time("foo")
  z().then(xx => {
    console.log(xx)
    console.timeEnd("foo")
  })
}

// main()

const unfoldTask_ = <A, B>(
  b: B,
  f: (b: B) => Task<Option<readonly [A, B]>>
): Task<readonly A[]> =>
  {

    let done = false
    while (!done) {

    }
  }
