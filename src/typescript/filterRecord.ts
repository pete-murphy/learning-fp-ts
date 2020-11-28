import { pipe } from "fp-ts/lib/pipeable"
import * as R from "fp-ts/lib/Record"

declare const deviceInfo: Record<string, string | undefined>

const isNotUndefined = <A>(x: A | undefined): x is A => x !== undefined

const metadata = pipe(deviceInfo, R.filter(isNotUndefined))
