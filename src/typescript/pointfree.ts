const mul = (x: number) => (y: number) => x * y;
const add = (x: number) => (y: number) => x + y;

const foo: (a: number) => number = a => add(1)(mul(2)(a));
const bar: (a: number) => number = (add(1), mul(2));
