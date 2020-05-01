import * as R from "fp-ts/lib/Record"
import { option, none, some, Option } from "fp-ts/lib/Option"

import { map_ } from "fp-ts/lib/Map"
import { Lens, Prism } from "monocle-ts"

// option.sequence()

type K = "x" | "y" | "z"

const getPrismOption = <V>(k: K) =>
  Prism.some<{ [k in K]: V }>().composeLens(Lens.fromProp<{ [k in K]: V }>()(k))
    .getOption

const fn = <V>(r: Option<Record<K, V>>): Record<K, Option<V>> => ({
  x: getPrismOption<V>("x")(r),
  y: getPrismOption<V>("y")(r),
  z: getPrismOption<V>("z")(r),
})

fn(none) //?
fn(some({ x: 1, y: 2, z: 3 })) //?

// Prism.some<{ [k in K]: number }>()
//   .composeLens(
//     Lens.fromProp<{ [k in K]: number }>()("x")
//   )
//   .getOption(none) //?

// Prism.some<{ [k in K]: number }>()
//   .composeLens(
//     Lens.fromProp<{ [k in K]: number }>()("x")
//   )
//   .getOption(some({ x: 3 })) //?
