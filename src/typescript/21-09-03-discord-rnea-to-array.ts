import * as RA from "fp-ts/ReadonlyArray"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"

const someMethodFrom3rdParty = (items: string[]) => {
  // ...
}

const arr: RNEA.ReadonlyNonEmptyArray<string> = ["item"]

someMethodFrom3rdParty(RA.toArray(arr)) // compiler error
