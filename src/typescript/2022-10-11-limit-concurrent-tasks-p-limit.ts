import {
  readonlyNonEmptyArray as RNEA,
  readonlyArray as RA,
  task as T,
  taskEither as TE,
  console as Console
} from "fp-ts";
import { pipe } from "fp-ts/function";
import * as Q from "@simspace/collections/Queue";
import * as pLimit from "p-limit";

// { n_: 0, l: 7, i: 0, xs: [] }
// start a
// { n_: 1, l: 7, i: 1, xs: [] }
// start b
// { n_: 2, l: 7, i: 2, xs: [] }
// start c
// { n_: 3, l: 7, i: 3, xs: [] }
// { n_: 3, l: 7, i: 3, xs: [] }

export type Subscription<A> = {
  readonly publish: (_: A) => void;
  readonly subscribe: (subscriber: (_: A) => void) => () => void;
};

const mkSubscription = <A>(): Subscription<A> => {
  const subscribers: Array<(_: A) => void> = [];
  return {
    subscribe: subscriber => {
      const i = subscribers.push(subscriber);
      return () => {
        subscribers.splice(i, 1);
      };
    },
    publish: x => subscribers.forEach(subscriber => subscriber(x))
  };
};

const traverseN =
  <A, B>(n: number, f: (a: A) => T.Task<B>) =>
  (as: ReadonlyArray<A>): T.Task<ReadonlyArray<B>> =>
  async () => {
    let n_ = 0;
    let i = 0;
    const l = as.length;
    let xs: Array<Promise<B>> = [];
    while (i < l) {
      console.log({ l, i, n_, xs });
      if (n_ < n) {
        n_++;
        const a = as[i++];
        xs.push(f(a)());
        // f(a)().then(b => {
        //   console.log("after .then(..)");
        //   xs.push(b);
        //   n_--;
        // });
      }
    }
    return Promise.all(xs);
  };

const main = () => {
  pipe(
    ["a", "b", "c", "d", "e", "f", "g"],
    traverseN(3, letter => {
      console.log("start", letter);
      return pipe(
        T.delay(500)(T.fromIO(Console.log(`end of task: ${letter}`))),
        T.apSecond(T.of(letter.toLocaleUpperCase()))
      );
    }),
    T.chainIOK(_ => Console.log("done"))
  )();
};

main();
