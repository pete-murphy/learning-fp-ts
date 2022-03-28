import { MonoidAny, SemigroupAny } from "fp-ts/lib/boolean"
import { pipe } from "fp-ts/lib/function"
import { identity } from "lodash"
import { O, RA, RNEA } from "./lib/fp-ts-imports"

declare const authLoading: boolean
declare const applicationsLoading: boolean
declare const marketsLoading: boolean

const loading_ = SemigroupAny.concat(
  authLoading,
  SemigroupAny.concat(applicationsLoading, marketsLoading)
)

const loading =
  authLoading || applicationsLoading || marketsLoading

declare const manyLoadingStates: RNEA.ReadonlyNonEmptyArray<boolean>

pipe(manyLoadingStates, RNEA.concatAll(SemigroupAny))
pipe(
  manyLoadingStates,
  RNEA.foldMap(SemigroupAny)(identity)
)

const option1 = O.none // option
const option2 = O.some(1)

pipe(
  option1,
  O.alt(() => option2)
)
;(() => {
  if (O.isNone(option1)) {
    return option2
  } else {
    return option1
  }
})()
