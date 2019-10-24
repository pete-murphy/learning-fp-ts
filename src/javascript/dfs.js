import state from "../json/local-2";

const isObject = o => typeof o === "object" && !Array.isArray(o) && o;

Array.prototype.flatMap = function(fn) {
  return this.reduce((acc, x) => [...acc, ...fn(x)], []);
};

const search = pred => (x, acc = []) =>
  pred(x)
    ? [{ path: acc, value: x }]
    : isObject(x)
    ? Object.keys(x).flatMap(k => search(pred)(x[k], [...acc, k]))
    : [];

const stringContains = re => x => typeof x === "string" && re.test(x);
const booleanIs = b => x => typeof x === "boolean" && x === b;
const keyContains = re => (
  x,
  k = isObject(x) && Object.keys(x).find(key => stringContains(re)(key))
) => !!k;

search(stringContains(/Abc/))(state); //?
