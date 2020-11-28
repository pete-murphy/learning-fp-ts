import * as RD from "@devexperts/remote-data-ts"
import { sequenceS } from "fp-ts/lib/Apply"
import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"
import * as O from "fp-ts/lib/Option"
import { flow } from "fp-ts/lib/function"

const browseResults: RD.RemoteData<
  ApiFetchError,
  Array<{
    key: string
    data: RD.RemoteData<ApiFetchError, CatalogEntry>
  }>
> = RD.initial
type ApiFetchError = {}
type CatalogEntry = {}

const browseResults_: RD.RemoteData<
  ApiFetchError,
  Array<{
    key: string
    data: RD.RemoteData<ApiFetchError, CatalogEntry>
  }>
> = RD.success([
  {key: "foo", data: },
])

// const resultItems: Array<{ key: string; data: CatalogEntry }> = pipe(
const resultItems = pipe(
  browseResults,
  RD.toOption,
  O.fold(
    () => [],
    flow(
      A.traverse(RD.remoteData)(({ key, data: dataRD }) =>
        pipe(
          dataRD,
          RD.map(data => ({ key, data }))
        )
      ),
      RD.getOrElse((): Array<{ key: string; data: CatalogEntry }> => [])
    )
  )
)

resultItems //?