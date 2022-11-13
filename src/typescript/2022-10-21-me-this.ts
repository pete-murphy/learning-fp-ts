export type Console = {
  log: <A extends ReadonlyArray<unknown>>(...args: A) => () => void;
};

export const C: Console = {
  log:
    (...args) =>
    () =>
      console.error.bind(null)(...args)
};

C.log(this)();
console.log(this);
