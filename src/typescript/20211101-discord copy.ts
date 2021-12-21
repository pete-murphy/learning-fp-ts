import * as A from "fp-ts/Array"
import * as RA from "fp-ts/ReadonlyArray"
import * as E from "fp-ts/Either"
import { flow, pipe, tuple } from "fp-ts/function"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import { RR } from "./ssstuff/fp-ts-imports"
// import * as TE from "fp-ts/TaskEither"

declare const interestedEthAddresses: ReadonlyArray<string>
declare const getNFTs: (index: number, interested: string) => T.Task<string>

pipe(
  T.Do,
  T.apS("interested", T.of(interestedEthAddresses)),
  T.bind("nfts", ({ interested }) =>
    T.traverseArrayWithIndex(getNFTs)(interested)
  )
)

// T.chainFirst(({nfts}) => T.traverseArray(nft => () => updateCache(nft))(nfts))
const fn: <E, A, B>(
  x: TE.TaskEither<E, { a: A; b: B }>
) => { a: TE.TaskEither<E, A>; b: TE.TaskEither<E, B> } = x => 
  RR.sequence(TE.ApplicativePar)({
  a: x
})

