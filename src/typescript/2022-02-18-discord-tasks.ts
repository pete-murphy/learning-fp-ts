import { flip, flow } from "fp-ts/lib/function"
import { Iso } from "monocle-ts"
import {
  pipe,
  RA,
  Str,
  RTE,
  Re,
  RT,
  TE,
  T,
  constant,
  Mn,
  Apl
} from "./lib/fp-ts-imports"

// Oops, pressed enter too early, sorry... Well anyway I want
// Promise<Material[]>, I was thinking I could maybe use
// https://gcanti.github.io/fp-ts/modules/Task.ts.html#map or
// https://gcanti.github.io/fp-ts/modules/Task.ts.html#flatten but I don't think
// I can actually

// Promise.all works of course but I was wondering about a nice way to put it into our pipe
// for another part of the application I do
//     modules: pipe(buildSystems, map(getModules), async ps => (await Promise.all(ps)).flat()
// looks a bit nasty to my eyes, would like to tidy it up slightly 😄

type BuildSystem = `BuildSystem${number}`
type Material_ = `Material${number}`
type Material = `BuildSystem${number}-Material${number}`
// declare const buildSystems: ReadonlyArray<BuildSystem>
// declare const getMaterials: (_: BuildSystem) => Promise<ReadonlyArray<Material>>
// declare const getMaterialsTask: (_: BuildSystem) => () => Promise<ReadonlyArray<Material>>
const buildSystems: ReadonlyArray<BuildSystem> = [
  "BuildSystem1",
  "BuildSystem2",
  "BuildSystem3"
]
const getMaterialsTask: (
  _: BuildSystem
) => () => Promise<ReadonlyArray<Material>> = buildSystem =>
  T.of(
    pipe(
      ["Material1", "Material2", "Material3"],
      RA.map(
        (x: Material_): Material =>
          `${buildSystem}-${x}` as Material
      )
    )
  )

// const foo: Promise<Material[]>[] = pipe(buildSystems, RA.map(getMaterials))
// const foo = pipe(buildSystems, RA.map(getMaterials))

const foo_ = pipe(
  buildSystems,
  T.traverseArray(getMaterialsTask),
  T.map(RA.flatten)
)

// foldMapA :: (Foldable t, Monoid m, Applicative f) => (a -> f m) -> t a -> f m
// foldMapA f = getAp . foldMap (Ap . f)

const MaterialsTaskMonoid = Apl.getApplicativeMonoid(
  T.ApplicativePar
)(RA.getMonoid<Material>())

const foo__ = pipe(
  buildSystems,
  RA.foldMap(MaterialsTaskMonoid)(getMaterialsTask)
)

foo_().then(console.log)
// [
//   'BuildSystem1-Material1',
//   'BuildSystem1-Material2',
//   'BuildSystem1-Material3',
//   'BuildSystem2-Material1',
//   'BuildSystem2-Material2',
//   'BuildSystem2-Material3',
//   'BuildSystem3-Material1',
//   'BuildSystem3-Material2',
//   'BuildSystem3-Material3'
// ]
foo__().then(console.log)
// [
//   'BuildSystem1-Material1',
//   'BuildSystem1-Material2',
//   'BuildSystem1-Material3',
//   'BuildSystem2-Material1',
//   'BuildSystem2-Material2',
//   'BuildSystem2-Material3',
//   'BuildSystem3-Material1',
//   'BuildSystem3-Material2',
//   'BuildSystem3-Material3'
// ]
