const isNumber = (x: unknown): x is number => typeof x === "number";

const isRealNumber = (x: unknown) => isNumber(x) && !isNaN(x);

isRealNumber(Infinity); //?
isRealNumber(true); //?
