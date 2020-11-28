const pipe = (initialValue, ...fns) =>
  fns.reduce((x, fn) => fn(x), initialValue)

pipe(
  1,
  x => x * 0,
  x => x + 3
) //?
