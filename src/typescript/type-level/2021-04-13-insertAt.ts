import { pipe } from "fp-ts/pipeable"
import * as RR from "fp-ts/ReadonlyRecord"

const oldRecord: Record<string, number> = {
  foo: 1,
}
pipe(oldRecord, RR.insertAt("bar", 2))
//-> { foo: 1, bar: 2 }
