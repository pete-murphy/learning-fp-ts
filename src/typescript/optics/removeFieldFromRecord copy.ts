// GCanti's version

import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { at, lens } from "monocle-ts"

type TestRunAgentState = {
  status: string
}

export type TestRunState = {
  agents: Record<string, TestRunAgentState>
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
const agents = pipe(lens.id<TestRunState>(), lens.prop("agents"))
const atTestRunAgentState = at.atRecord<TestRunAgentState>()
const myAgent = pipe(agents, lens.compose(atTestRunAgentState.at("agent-1")))
console.log(myAgent.set(O.none)(example))
// { agents: { 'agent-2': { status: 'pending' } } }
