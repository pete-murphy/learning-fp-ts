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

const sub = new RX.Subject<number>();

const xLoaded = pipe(
  sub.asObservable(),
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
  new Promise(resolve => {
    setTimeout(() => {
      sub.next(1);
      sub.next(2);
      sub.next(3);
      sub.next(4);
      sub.next(5);
      sub.next(6);
      sub.next(7);
      sub.next(8);
      sub.next(9);
      sub.next(10);
      resolve(void 0);
    }, 1_000);
  });
  console.time("main > t1");
  await t1({})();
  console.timeEnd("main > t1");
  console.time("main > t2");
  await t2({})();
  console.timeEnd("main > t2");
};

main();
