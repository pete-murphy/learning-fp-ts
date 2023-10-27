import { pipe } from "fp-ts/function";
import {
  readonlyMap as M,
  readonlyArray as A,
  number as N,
  string as S,
  semigroup as Sg,
  option as O,
} from "fp-ts";
import * as uuid from "uuid";

// const array1: string[] = ["cat", "dog", "horse", "bird"];
// const array2: (string | number)[] = ["red", "blue", "green", 5];
const mkArray = <A>(f: (i: number) => A) =>
  pipe(
    A.unfold(0, i =>
      i < 999 ? O.some([f(i), i + 1]) : O.none,
    ),
  );

const array1 = mkArray(i => i);
const array2 = mkArray(_ => uuid.v4());

function main() {
  console.time("A");
  const mylookup: ReadonlyMap<number, string> = pipe(
    array1,
    A.zip(array2),
    M.fromFoldable(N.Eq, Sg.first(), A.Foldable),
  );
  console.log(mylookup.get(100));
  console.timeEnd("A");

  console.time("B");
  let m = new Map();
  for (
    let i = 0;
    i < Math.min(array1.length, array2.length);
    i++
  ) {
    m.set(array1[i], array2[i]);
  }
  console.log(m.get(100));
  console.timeEnd("B");
}

main();
