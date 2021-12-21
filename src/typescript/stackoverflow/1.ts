// https://stackoverflow.com/questions/60974400/converting-taskreadera-b-to-readertaska-b-with-fp-ts
import { pipe } from "fp-ts/lib/function"
import * as T from "fp-ts/Task"
import * as Rd from "fp-ts/Reader"
import * as RT from "fp-ts/ReaderTask"
import * as Ap from "fp-ts/Apply"
import * as Apl from "fp-ts/Applicative"
import { E } from "../ssstuff/fp-ts-imports"

// function fromTaskReader<A, B>(taskReader: Task<Reader<A, B>>): ReaderTask<A, B> {
//   return (context: A): Task<B> => pipe(
//     taskReader,
//     map((reader) => reader(context)),
//   );
// }
// const fromTaskReader: <A, B>(taskReader: T.Task<Rd.Reader<A, B>>) => RT.ReaderTask<A, B> =
