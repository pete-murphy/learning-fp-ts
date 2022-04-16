import { Apply1 } from "fp-ts/lib/Apply"
import {
  Ap,
  Mn,
  N,
  pipe,
  RA,
  RR,
  RNEA,
  O,
  flow,
  TE
} from "./lib/fp-ts-imports"

const groundIndex = 0
const roofIndex = 5

const pairs = pipe(
  RNEA.range(groundIndex, roofIndex),
  RA.map(i =>
    pipe(
      columnLayout[columnIndex].gridGroups[i].modules,
      RA.reduce(
        { gridUnits: 0, module: null },
        (
          acc: {
            gridUnits: number
            module: LoadedModule | null
          },
          { module }
        ) => {
          const nextGridUnits =
            acc.gridUnits + module.structuredDna.gridUnits
          return {
            gridUnits: nextGridUnits,
            module:
              acc.gridUnits === targetGridUnits
                ? module
                : acc.module
          }
        }
      ),
      ({ module }) => {
        if (module === null)
          throw new Error(
            "Appropriate stairs module not found where expected"
          )
        return [i, module] as [number, LoadedModule]
      }
    )
  ),
  RA.fromFoldable(Eq, { concat: identity }, Foldable)
)
