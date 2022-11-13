// In my first practice with pipe, I was understanding the first argument to be
// the data upon which subsequent functions will operate. So, am I correct that
// an object gets created of all the summaries (if there was 100 years worth of
// data, all 100 years would get summaries created?) and then only though
// meeting the prefilter criteria get passed out of the pipe?

import { pipe } from "fp-ts/function";

type Fn<Input, Output> = (a: Input) => Output;
const fnPlus1: Fn<number, number> = n => n + 1;

// map takes a Fn<Input, Output> and modifies the Output
const map =
  <Out1, Out2>(
    mapper: (out1: Out1) => Out2
  ): (<Input>(fn: Fn<Input, Out1>) => Fn<Input, Out2>) =>
  fn =>
  x =>
    mapper(fn(x));

// premap takes a Fn<Input, Output> and modifies the Input _before_ it reaches the Fn
const premap =
  <In1, In2>(
    premapper: (in1: In1) => In2
  ): (<Output>(fn: Fn<In2, Output>) => Fn<In1, Output>) =>
  fn =>
  x =>
    fn(premapper(x));

const newFn = pipe(
  fnPlus1,
  map(n => n.toString()),
  premap((n: number) => n * 100)
);

newFn(1); //?
