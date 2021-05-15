import { pipe } from "fp-ts/lib/function"
import * as L from "monocle-ts/lib/Lens"
import * as T from "monocle-ts/lib/Traversal"
import * as At from "monocle-ts/lib/At"
import * as O from "fp-ts/lib/Option"
import * as RR from "fp-ts/lib/ReadonlyRecord"

export type TestRunState = {
  agents: Record<string, TestRunAgentState>
}

type TestRunAgentState = {
  status: string
}

const example: TestRunState = {
  agents: {
    "agent-1": {
      status: "pending",
    },
    "agent-2": {
      status: "pending",
    },
  },
}

const removeAgent1 = pipe(
  T.id<TestRunState>(),
  T.prop("agents"),
  T.traverse(RR.Traversable),
  T.atKey("agent-1"),
  T.modify((): O.Option<string> => O.none)
)

const removeAgent1_ = pipe(
  L.id<TestRunState>(),
  L.prop("agents"),
  L.modify(RR.deleteAt("agent-1"))
)

removeAgent1(example)
//->  { agents: { 'agent-2': { status: 'pending' } } }

removeAgent1_(example) //?
