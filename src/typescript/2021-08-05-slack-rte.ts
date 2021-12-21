import * as t from "io-ts"
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as NEA from "fp-ts/lib/NonEmptyArray"
import { pipe, flow } from "fp-ts/lib/function"

const myRTENumber1 = RTE.of([1])
const myRTENumber2 = RTE.of([2])

const x = pipe(
  // Let's say the success type for this RTE is an Array<number>
  myRTENumber1,
  // I only want to do further computation if the array is not empty, so I lift into a nonEmptyArray
  RTE.chain(
    flow(
      NEA.fromArray,
      RTE.fromOption(() => "Received empty array")
    )
  ),
  // This is where I'm stuck: how do I chain myRTENumber2 inside the Option?
  // RTE.apSecond(myRTENumber2)
  RTE.chainW(firstResultArray => pipe(
    myRTENumber2,
    RTE.map(secondResultArray => [...firstResultArray, ...secondResultArray])
  ))
  // RTE.map(x => x)
)

const x_ = pipe(
  RTE.Do,
  RTE.apS('number1',myRTENumber1),
  RTE.bind('nonEmptyNumber1', ({number1}) => pipe(
    NEA.fromArray(number1),
    RTE.fromOption(() => "Received empty array")
  )),
  RTE.apSW('number2', myRTENumber2),
  RTE.map(({nonEmptyNumber1, number2}) => )
 
  // RTE.apS(
  //   myRTENumber2,
  //   RTE.map(secondResultArray => [...firstResultArray, ...secondResultArray])
  // ))
  // RTE.map(x => x)
)
