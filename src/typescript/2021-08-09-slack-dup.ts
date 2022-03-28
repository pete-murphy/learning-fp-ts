import * as RTup from "fp-ts/lib/ReadonlyTuple"
import { curry } from "lodash/fp"
import {
  Id,
  Mn,
  RA,
  Sg,
  Re,
  tuple
} from "./lib/fp-ts-imports"

const dup = Re.flatten(x => y => tuple(x, y))
// dup(3) //?
