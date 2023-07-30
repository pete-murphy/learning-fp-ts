import { taskEither as TE, either as E } from "fp-ts";

const t1 = () =>
  new Promise(_ => {
    throw new Error("💩1");
  });
const t2 = () => new Promise((_, rej) => rej(new Error("💩2")));
const e1 = () => {
  throw new Error("💩3");
};

const te1 = TE.tryCatch(t1, console.log);
const te2 = TE.tryCatch(t2, console.log);
const te3 = TE.tryCatch(e1, console.log);

te1();
te2();
te3();
