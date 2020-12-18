import { pipe } from "fp-ts/lib/function"
import * as L from "monocle-ts/lib/Lens"
import * as Op from "monocle-ts/lib/Optional"

export declare type ResultStatus =
  | "pending"
  | "running"
  | "failed"
  | "ok"
  | "disregarded"

export interface TestResult {
  status: ResultStatus
  children: readonly TestResult[]
}

type TestRunAgentState = {
  status: string
  result: TestResult
}

export type TestRunState = {
  agents: Record<string, TestRunAgentState>
}

const example: TestRunState = {
  agents: {
    "agent-1": {
      status: "pending",
      result: {
        status: "pending",
        children: [
          {
            status: "pending",
            children: [],
          },
        ],
      },
    },
  },
}

const lens = pipe(
  L.id<TestRunState>(),
  L.prop("agents"),
  L.key("agent-1"),
  Op.prop("result"),
  Op.prop("children"),
  Op.index(0),
  Op.prop("status")
)

const example_ = lens.set("ok")(example)
console.log(JSON.stringify(example_, null, 2))
/*
{
  "agents": {
    "agent-1": {
      "status": "pending",
      "result": {
        "status": "pending",
        "children": [
          {
            "status": "ok",
            "children": []
          }
        ]
      }
    }
  }
}
 */
console.log(Array.isArray(example_.agents["agent-1"].result.children))
// -> true
