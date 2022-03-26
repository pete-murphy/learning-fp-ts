import {
  pipe,
  RA,
  RNEA,
  Str
} from "./ssstuff/fp-ts-imports"

export const joinWith =
  (separator: string) =>
  (strings: ReadonlyArray<string>): string =>
    strings.join(separator)

const x = pipe(
  ["Foo", "Bar"],
  RNEA.matchRight((initialPath_, node) => {
    const initialPath: string = pipe(
      initialPath_,
      RA.append(""),
      joinWith(" / ")
    )
    return initialPath
  })
)

console.log({ x })
