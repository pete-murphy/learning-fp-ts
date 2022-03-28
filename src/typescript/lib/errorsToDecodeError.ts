import * as FS from "io-ts/lib/FreeSemigroup"
import * as DE from "io-ts/lib/DecodeError"
import * as D from "io-ts/lib/Decoder"
import * as PR from "io-ts/PathReporter"
import * as t from "io-ts"
import { E, flow, pipe, RA } from "./fp-ts-imports"
import { DateFromISOString } from "io-ts-types"

// export interface Errors extends Array<ValidationError> {}

const errorsToDecodeError: (errors: t.Errors) => DE.DecodeError<string> =
  RA.foldLeft(
    () => DE.leaf(null, "Empty errors"),
    (head, tail) =>
      pipe(
        tail,
        RA.reduceRightWithIndex(
          DE.leaf(head.value, getMessage(head)),
          (i, validationError, decodeError) =>
            DE.member(
              i,
              FS.concat(
                FS.of(
                  DE.leaf(validationError.value, getMessage(validationError))
                ),
                FS.of(decodeError)
              )
            )
        )
      )
  )

function getFunctionName(f: Function): string {
  return (f as any).displayName || (f as any).name || `<function${f.length}>`
}

function stringify(v: any): string {
  if (typeof v === "function") {
    return getFunctionName(v)
  }
  if (typeof v === "number" && !isFinite(v)) {
    if (isNaN(v)) {
      return "NaN"
    }
    return v > 0 ? "Infinity" : "-Infinity"
  }
  return JSON.stringify(v)
}

function getContextPath(context: t.Context): string {
  return context.map(({ key, type }) => `${key}: ${type.name}`).join("/")
}

function getMessage(e: t.ValidationError): string {
  return e.message !== undefined
    ? e.message
    : `Invalid value ${stringify(e.value)} supplied to ${getContextPath(
        e.context
      )}`
}

pipe(
  DateFromISOString.decode("sdfdsf"),
  E.mapLeft(errorsToDecodeError),
  E.mapLeft(flow(FS.of, D.draw))
) //?

pipe(
  t.Int.decode("sdf"),
  E.mapLeft(errorsToDecodeError),
  E.mapLeft(flow(FS.of, D.draw))
) //?

pipe(
  t
    .type({
      foo: t.Int,
    })
    .decode("sadf"),
  E.mapLeft(errorsToDecodeError),
  E.mapLeft(flow(FS.of, D.draw))
) //?

pipe(
  t
    .type({
      foo: t.Int,
    })
    .decode({ bar: "sadf" }),
  E.mapLeft(errorsToDecodeError),
  E.mapLeft(flow(FS.of, D.draw))
) //?
