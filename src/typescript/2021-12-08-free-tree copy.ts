import { pipe } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray"
import * as R from "fp-ts/Record"



const addItems = (items: Array<T>) =>
    items.reduce(
      (acc, cur) => R.upsertAt(selectProps.getId(cur), cur)(acc),
      selectProps.selected,
    )

R.fromFoldableMap

R.getUnionMonoid