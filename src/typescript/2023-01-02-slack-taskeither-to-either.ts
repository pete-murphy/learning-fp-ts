// Hello, I’m blocked on a common case but I didn’t find answer, I want to transform a TaskEither to an Either

// const copyFile = (sourcePath: string, targetPath: string) =>
//   pipe(
//     TE.tryCatch(
//       () =>
//         new Promise<boolean>((resolve, reject) => {
//           mkdirForFilePath(targetPath)
//           fileSystem.copyFile(sourcePath, targetPath, err => (err ? reject(err) : resolve(true)))
//         }),
//       err =>
//         new Error(`Error while copying file: ${sourcePath} -> ${targetPath} (${String(err)})`)
//     ),
//     // the "magic" code I try to find to transform this task and reach the .bindL requirement
// )

// const copyFileLocation = (sourceFileLocation: FileLocation, targetFileLocation: FileLocation) =>
//   either.Do()
//     .bind('sourceUri', getUri(sourceFileLocation))
//     .bind('targetUri', getUri(targetFileLocation))
//     .bindL('result', ({ sourceUri, targetUri }) =>
//         copyFile(sourceUri, targetUri) // need an either but get a taskEither
//     )
//     .return(({ result }) => result)

import { pipe } from "fp-ts/function";
import { either as E, taskEither as TE } from "fp-ts";

declare const mkdirForFilePath: (targetPath: string) => void;
type FileLocation = string;
declare const copyFile: (
  sourcePath: string,
  targetPath: string,
) => TE.TaskEither<Error, void>;
declare const getUri: (fileLocation: FileLocation) => E.Either<Error, string>;

const copyFileLocation = (
  sourceFileLocation: FileLocation,
  targetFileLocation: FileLocation,
) =>
  pipe(
    TE.Do,
    TE.apS("sourceUri", TE.fromEither(getUri(sourceFileLocation))),
    TE.apS("targetUri", TE.fromEither(getUri(targetFileLocation))),
    TE.chain(({ sourceUri, targetUri }) => copyFile(sourceUri, targetUri)),
  );
// either
//   .Do()
//   .bind("sourceUri", getUri(sourceFileLocation))
//   .bind("targetUri", getUri(targetFileLocation))
//   .bindL(
//     "result",
//     ({ sourceUri, targetUri }) => copyFile(sourceUri, targetUri), // need an either but get a taskEither
//   )
//   .return(({ result }) => result);
