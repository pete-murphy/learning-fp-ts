import { pipe } from "fp-ts/lib/pipeable"
import { match } from "./matchers"

export type TicketDetail =
  | {
      tag: "tracking"
    }
  | {
      tag: "info"
      contents: string
    }
  | {
      tag: "change"
      contents: number
    }

const ex1: TicketDetail = {
  tag: "tracking",
}

const ex2: TicketDetail = {
  tag: "change",
  contents: 200,
}

pipe(
  ex1 as TicketDetail,
  match({
    tracking: () => "I'm super tracked!",
    info: i => i.contents,
    change: c => String(c.contents),
  })
)
