import * as NEA from "fp-ts/lib/NonEmptyArray"
import NonEmptyArray = NEA.NonEmptyArray

const potato = true

const a = (xs: NonEmptyArray<string>) => xs
const b: NonEmptyArray<number> = [1, 2]
const c = potato ? [3] : []
const d = NEA.concat(c, b)

const ne: NonEmptyArray<number> = [...[1, 2]]
