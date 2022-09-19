import { option as O, string as Str, readonlyArray as RA } from "fp-ts";
import { flow, identity } from "fp-ts/function";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { A, TE } from "./lib/fp-ts-imports";

// Hi.     I have a value x: TaskEither<Err,Val>[] and I am using that in const
// y = A.sequence(TE.ApplicativeSeq)(x). I was expecting y:
// TaskEither<Err,Val[]>, but am instead seeing TaskEither<unknown,any> Am I not
// using these correctly, or do I need to add a type assertion?

interface Err {}
interface Val {}

declare const x: TaskEither<Err, Val>[];

const y = A.sequence(TE.ApplicativeSeq)(x);

y;
