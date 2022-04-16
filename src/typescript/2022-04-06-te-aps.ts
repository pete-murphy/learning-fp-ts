import { Apply1 } from "fp-ts/lib/Apply"
import {
  Ap,
  Mn,
  N,
  pipe,
  RA,
  RR as R,
  RNEA,
  O,
  flow,
  RR,
  TE
} from "./lib/fp-ts-imports"

pipe(
  TE.Do,
  TE.apS("_", TE.left("foo")),
  TE.apS(
    "x",
    TE.fromIO(() => console.log("asl;kdfjlsakdjfl;sdjf"))
  )
)()
