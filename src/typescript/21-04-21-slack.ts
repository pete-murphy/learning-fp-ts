import * as Mn from "fp-ts/Monoid"
import * as RA from "fp-ts/ReadonlyArray"

type Response<T> = { truncated: boolean; results: ReadonlyArray<T> }

const getMonoidResponse = <T>(): Mn.Monoid<Response<T>> =>
  Mn.getStructMonoid<Response<T>>({
    truncated: Mn.monoidAny,
    results: RA.getMonoid<T>(),
  })

declare const responses: Array<Response<string>>

const folded: Response<string> = Mn.fold(getMonoidResponse<string>())(responses)
