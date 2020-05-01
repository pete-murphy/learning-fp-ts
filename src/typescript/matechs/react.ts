import { effect as T } from "@matechs/effect"
import * as React from "react"

export const HooksURI = "@uris/Hooks"

export interface Hooks {
  [HooksURI]: {
    useState: <T>(initialState: T) => T.UIO<[T, (t: T) => void]>
  }
}

export const useState = <T>(
  initial: T
): T.Effect<Hooks, never, [T, (t: T) => void]> =>
  T.accessM(({ [HooksURI]: { useState } }: Hooks) => useState(initial))

export const provideHooks = T.provideS<Hooks>({
  [HooksURI]: {
    useState: initial => T.sync(() => React.useState(initial)),
  },
})
