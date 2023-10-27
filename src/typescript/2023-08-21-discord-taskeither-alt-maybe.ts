import { TE, pipe } from "./lib/fp-ts-imports";

async function main() {
  const result = await pipe(
    TE.Do,
    TE.apS(
      "value",
      TE.tryCatch(
        () => Promise.resolve(5),
        () => "foobar",
      ),
    ),
    TE.chainW(({ value }) =>
      pipe(
        value > 5 ? TE.left(null) : TE.right(value),
        TE.altW(() =>
          value < 5 ? TE.left(null) : TE.right(value),
        ),
      ),
    ),
  )();
}
