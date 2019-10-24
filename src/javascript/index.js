import * as L from "partial.lenses";
import * as R from "ramda";

const state = {
  x: {
    elems: [{ key: 1, value: "a" }, { key: 2, value: "b" }]
  }
};

const foo = L.modify(
  ["x", "elems", L.whereEq({ key: 1 })],
  R.assoc("foo", "r")
)(state); //?
const bar = L.set(["x", "elems", L.whereEq({ key: 1 })], {})(state); //?
// const baz1 = L.over(["x", "elems", L.whereEq({key: 1})], R.assoc("foo", "r"))(state); //?
// const baz2 = R.over(R.lensPath(["x", "elems", L.whereEq({key: 1})]), R.assoc("foo", "r"))(state); //?

foo.x; //?
bar.x; //?
// baz.x //?
