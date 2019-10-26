import { array, getMonoid } from "fp-ts/lib/Array";
import { fromFoldable } from "fp-ts/lib/Record";

type X = {
  name: string;
  id: number;
};

const xs = [
  { name: "foo", id: 1 },
  { name: "bar", id: 2 },
  { name: "foo", id: 3 }
];
fromFoldable(getMonoid<X>(), array)(xs.map(x => [x.name, [x]])); //?
