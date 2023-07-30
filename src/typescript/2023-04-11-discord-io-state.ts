import { task as T, state as St, stateT as StT, readerTask as RT } from "fp-ts";
import { pipe } from "fp-ts/function";

import readline from "readline";
import process from "process";

const getLine: RT.ReaderTask<readline.Interface, string> = interface_ => () =>
  new Promise(resolve => interface_.question("", resolve));
const putLine =
  (msg: string): RT.ReaderTask<readline.Interface, void> =>
  interface_ =>
  () =>
    new Promise(resolve => resolve(interface_.write(msg)));

// const main = pipe(

// const main = pipe(
