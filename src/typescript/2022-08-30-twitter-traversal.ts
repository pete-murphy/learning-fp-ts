import * as T from "monocle-ts/Traversal"
import {
  boolean as B,
  readonlyArray as RA
} from "fp-ts"
import { pipe } from "fp-ts/function"

type Project = {
  string_id: string
  permissions: ReadonlyArray<
    "link_management" | "other"
  >
}

export function isLinkOwner(
  selectedProjectId: string | undefined
): (projects: ReadonlyArray<Project>) => boolean {
  return pipe(
    T.id<ReadonlyArray<Project>>(),
    T.findFirst(
      p => p.string_id === selectedProjectId
    ),
    T.prop("permissions"),
    T.traverse(RA.Traversable),
    T.foldMap(B.MonoidAny)(
      permission =>
        permission === "link_management"
    )
  )
}
