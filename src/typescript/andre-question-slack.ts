/**
 * So, wrappedExecCall() is what I want to put into an IOEither. Thing is
 * that I get an error:
 *    "Type 'string' is not assignable to type 'IOEither<Error, string>'" (1)
 *
 * I'm not sure how to wrap the results of execSync as IOEither doesn't have
 * the applicative .of() function to use. I can wrap it in an Either but this
 * doesn't seem like the right solution either. Too complex or messy. How does
 * one wrap the string outputs into an IOEither<Error, string> without an
 * IOEither.of?
 *
 * Next up I want to compose it into a tryCatch function but getting that to
 * work is also alluding me. Once that is working I believe that it will be,
 * hopefully, straight forward addition into my pipeline (pipe()) composition
 * that currently exists as shown below. I hope to be able to just swap out
 * the file reader with this execSync function.
 *
 * I do have questions about the R.chain here. Originally this was without the
 * wrappedCall method and works fine with the R.chain here. I thought that the
 * Reader monad was for injecting dependencies into functions but we're using
 * here to execute the composition therein.
 */
import { flow, pipe } from "fp-ts/function"
import { IOEither, tryCatch, getOrElse, ioEither } from "fp-ts/lib/IOEither"
import { toError, Either } from "fp-ts/lib/Either"
import * as R from "fp-ts/lib/Reader"
import * as IO from "fp-ts/lib/IO"
import fs from "fs"
import { constant } from "fp-ts/lib/function"
import { execSync } from "child_process"

// (1) Type 'string' is not assignable to type 'IOEither<Error, string>'
const wrappedExecCall = (cmd: string): IOEither<Error, string> =>
  ioEither.of(
    execSync(cmd, { stdio: "pipe" })
      .toString()
      .split("\n")[0]
      .replace("(fetch)", "")
      .replace("origin", "")
      .trim()
  )

const doAThingThatThrows = (str: string): IOEither<Error, string> =>
  tryCatch(
    () => wrappedExecCall(str), // This is what I want to call
    toError
  )

const functionToCall = pipe(
  doAThingThatThrows,
  R.chain(getOrElse(constant(IO.of("whoopsies"))))
)

console.log(functionToCall("./bin/cli.ts~")) // failure message is printed out.
console.log(functionToCall("./bin/cli.ts")) // some text is printed out.
