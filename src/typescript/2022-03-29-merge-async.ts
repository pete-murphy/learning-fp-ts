import { pipe, TE, RTE } from "./lib/fp-ts-imports"

type InputObject = "InputObject"
type OutputItem = "OutputItem"
type OutputObject = "OutputObject"

declare const fn1: (
  input: InputObject
) => TE.TaskEither<Error, OutputItem>
declare const fn2: (
  input: InputObject
) => TE.TaskEither<Error, OutputItem>
declare const fn3: (
  input: InputObject
) => TE.TaskEither<Error, OutputItem>

declare const o: InputObject
declare const intelligentlyMerge: (
  items: ReadonlyArray<OutputItem>
) => OutputObject

const ex_fixed: TE.TaskEither<Error, OutputObject> = pipe(
  TE.Do,
  TE.apS("res1", fn1(o)),
  TE.apS("res2", fn2(o)),
  TE.apS("res3", fn3(o)),
  TE.map(({ res1, res2, res3 }) =>
    intelligentlyMerge([res1, res2, res3])
  )
)

const ex_dynamic: TE.TaskEither<Error, OutputObject> = pipe(
  [fn1(o), fn2(o), fn3(o)], // List could be any length
  TE.sequenceArray,
  TE.map(intelligentlyMerge)
)

const ex_dynamic_reader: TE.TaskEither<
  Error,
  OutputObject
> = pipe(
  [fn1, fn2, fn3], // List could be any length
  RTE.sequenceArray,
  RTE.map(intelligentlyMerge)
)(o)

// // i need InputObject => OutputObject
// pipe(
//   o, // InputObject
//   somehowParallelize( // idk what this is but it feels like it ought to exist in fp-ts?
//     fn1, // all these are InputObject => Either<Error, OutputItem>
//     fn2,
//     fn3,
//   ),
//   intelligentlyMerge // Either<Error (or Error[]?), OutputItem[]> => OutputObject, custom fn i know how to write that uses a reducer to merge the OutputItems per domain
// )

// // i need InputObject => OutputObject
// pipe(
//   o, // InputObject
//   somehowParallelize(
//     // idk what this is but it feels like it ought to exist in fp-ts?
//     fn1, // all these are InputObject => Either<Error, OutputItem>
//     fn2,
//     fn3
//   ),
//   intelligentlyMerge // Either<Error (or Error[]?), OutputItem[]> => OutputObject, custom fn i know how to write that uses a reducer to merge the OutputItems per domain
// )
