const subValueInArr = (arr, val, idx) => {
  return [...arr.slice(0, idx), val, ...arr.slice(idx + 1)];
};

const subValueInArr2 = (arr, val, idx) => {
  return arr.map((x, i) => (i === idx ? val : x));
};

const subValueInArr3 = (arr, val, idx) => {
  return Object.assign([...arr], { [idx]: val });
};

const ex1 = [[1, 2], "foo", 2];
const ex2 = [[1], "bar", 1];
const ex3 = [1, 2];
const ex4 = [1, 2, 3, 4, 5, 6];

const arrEq = (xs, ys) => JSON.stringify(xs) === JSON.stringify(ys);

console.assert(arrEq(subValueInArr(ex2, 99, 2), subValueInArr2(ex2, 99, 2)));

const arr = [1, 2, 3];
subValueInArr(arr, "foo", 4); //?
subValueInArr2(arr, "foo", 4); //?
subValueInArr3(arr, "foo", 4); //?

subValueInArr(...ex2); //?
subValueInArr2(...ex2); //?
subValueInArr(...ex1); //?
// subValueInArr2(...ex1); //?
// subValueInArr3(...ex1); //?
subValueInArr3(...ex1); //?
console.assert(arrEq(subValueInArr(ex3), subValueInArr2(ex3)));
console.assert(arrEq(subValueInArr(ex4), subValueInArr2(ex4)));

const foo = Object.assign([], [1, 2, 3], { 5: "foo" }); //?

Array.isArray(foo); //?
