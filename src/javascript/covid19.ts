import fetch from "node-fetch"
import { csvParse, timeParse } from "d3"
import { IO } from "fp-ts/lib/IO"
import * as t from "io-ts"
import { TaskEither } from "fp-ts/lib/TaskEither"
import { mapLeft } from "fp-ts/lib/Either"

const URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"

const stateURL = "https://covidtracking.com/api/states"

const StateData = t.type({
  totalTestResults: t.number,
  positive: t.number,
  state: t.string,
})

type StateData = t.TypeOf<typeof StateData>

const apiResponse = t.readonlyArray(StateData)

// const trace = msg => x => (console.log(msg, x), x)

const stateTestData: TaskEither<string, ReadonlyArray<StateData>> = () =>
  fetch(stateURL)
    .then(res => res.json())
    .then(apiResponse.decode)
    .then(mapLeft(JSON.stringify))

// stateTestData() //?
// const main = () =>
//   fetch(stateURL)
//     .then(res => res.json())
//     .then()
//     .then(trace("HElllllo"))

// main()
