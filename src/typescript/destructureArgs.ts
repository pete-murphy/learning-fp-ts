type Obj = { a: string; b: boolean; c: number }
const foo: (obj: Obj, obj_?: Obj) => void = (obj, { a, b, c } = obj) =>
  b ? a : JSON.stringify(obj).repeat(c)

foo({ a: "a", b: true, c: 99 }) //?
foo({ a: "a", b: false, c: 99 }) //?
