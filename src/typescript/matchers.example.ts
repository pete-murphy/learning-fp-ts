import { pipe } from "fp-ts/function";
import { match } from "@simspace/matchers";

export type TicketDetail =
  | {
      tag: "tracking";
    }
  | {
      tag: "info";
      contents: string;
    }
  | {
      tag: "change";
      contents: number;
    };

const ex1: TicketDetail = {
  tag: "tracking"
};

const ex2: TicketDetail = {
  tag: "change",
  contents: 200
};

pipe(
  ex1 as TicketDetail,
  match.w({
    tracking: () => "I'm super tracked!",
    info: i => i.contents,
    change: c => String(c.contents)
  })
);
