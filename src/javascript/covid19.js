import fetch from "node-fetch"
import { csvParse, timeParse } from "d3"

const URL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"

const stateURL = "https://covidtracking.com/api/states"

const trace = msg => x => (console.log(msg, x), x)

// fetch(URL)
//   .then(res => res.text())
//   .then(csvParse)
//   .then(x => x.columns.slice(4))
//   .then(xs => xs.map(timeParse("%m/%d/%y")))
//   .then(trace("What"))

const stateTestData = () =>
  fetch(stateURL)
    .then(res => res.json())
    .then(res =>
      res.map(({ state, totalTestResults, positive }) => ({
        state,
        totalTestResults,
        positive,
      }))
    )

const main = () =>
  fetch(stateURL)
    .then(res => res.json())
    .then(trace("HElllllo"))

// stateTestData() //?
