// ORIGINAL
import { constant, identity, pipe } from "fp-ts/lib/function"
import { Lens, Index } from "monocle-ts"
import * as O from "fp-ts/Option"

export declare type ResultStatus =
  | "pending"
  | "running"
  | "failed"
  | "ok"
  | "disregarded"

export interface TestResult {
  status: ResultStatus
  children: TestResult[]
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

let lens = new Lens<TestRunState, TestRunState>(identity, constant)

let next = pipe(
  {},
  O.fromNullable,
  O.map(s => lens.asOptional().set(example)(s as any)),
  O.toUndefined
)

console.log(Array.isArray(next?.agents["agent-1"].result.children)) // true

let lens2 = lens.compose(
  Lens.fromPath<TestRunState>()([
    "agents",
    "agent-1",
    "result",
    "children",
    "0",
    "status",
  ] as any)
) as any

const status2 = lens2.set("ok")(next)

console.log(Array.isArray(status2.agents["agent-1"].result.children)) // false
