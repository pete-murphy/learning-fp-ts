import { flip, flow } from "fp-ts/lib/function"
import { Iso } from "monocle-ts"
import {
  pipe,
  RA as AR,
  Str as S,
  RTE,
  Re,
  RT,
  TE,
  T,
  constant,
  Eq
} from "./lib/fp-ts-imports"

const always: Eq.Eq<any> = { equals: (x, y) => true }

type A = { x: string; y: string; z: string }
const v1: A = { x: "1", y: "2", z: "3" }
const v2: A = { x: "1", y: "2", z: "4" }

const AEq: Eq.Eq<A> = Eq.struct({ x: S.Eq, y: S.Eq })

AEq.equals(v1, v2) //?

declare const as: ReadonlyArray<A>
const uniqAs = AR.uniq(AEq)(as)
