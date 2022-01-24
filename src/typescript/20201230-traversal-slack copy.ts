import { pipe } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray"
import * as E from "fp-ts/Either"
import * as T from "monocle-ts/Traversal"
import * as RD from "@devexperts/remote-data-ts"
import {
  Traversable1,
  Traversable2
} from "fp-ts/lib/Traversable"
import { O } from "./ssstuff/fp-ts-imports"
import { HKT, Kind, URIS } from "fp-ts/lib/HKT"
import { Applicative } from "fp-ts/lib/Applicative"

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    RemoteData: RD.RemoteData<E, A>
  }
}

type A = ReadonlyArray<O.Option<{ foo: string }>>

const f = pipe(
  T.fromTraversable(RD.remoteData)<Error, A>(),
  T.traverse(RA.Traversable),
  T.traverse(O.Traversable),
  T.prop("foo"),
  T.modify(x => x.toLocaleUpperCase())
)

f(RD.success([O.some({ foo: "hello" })])) //?

export {}
