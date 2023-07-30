import {
  task as T,
  state as St,
  option as O,
  stateT as StT,
  readerTask as RT,
} from "fp-ts";
import { observable as Obs, readerObservable as RO } from "fp-ts-rxjs";
import * as RX from "rxjs";
import { pipe } from "fp-ts/function";

const sub = new RX.Subject();

// An observable that emits a value every second
const x$ = pipe(
  RX.interval(1_000),
  RX.map(x => x + 1),
  RX.take(10),
);

const xLoaded = pipe(
  x$,
  RX.find((x: number) => x % 2 === 0),
  RO.fromObservable,
  RO.toReaderTask,
);

const t1 = pipe(
  xLoaded,
  RT.chainFirstIOK(x => () => console.log("t1", `x: ${x}`)),
);
const t2 = pipe(
  xLoaded,
  RT.chainFirstIOK(x => () => console.log("t2", `x: ${x}`)),
);

const main = async () => {
  console.time("main > t1");
  await t1({})();
  console.timeEnd("main > t1");
  console.time("main > t2");
  await t2({})();
  console.timeEnd("main > t2");
};

main();
