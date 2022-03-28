import * as d3 from "d3-dsv"
import fs from "fs/promises"
import * as RA from "fp-ts/ReadonlyArray"
import * as O from "fp-ts/Option"
import * as E from "fp-ts/Either"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import { pipe } from "fp-ts/function"
import * as Str from "fp-ts/string"
import * as Ord from "fp-ts/Ord"
import { TE } from "../lib/fp-ts-imports"
import fetch from "node-fetch"

type Row = {
  readonly date: string
  readonly state: string
  readonly fips: number
  readonly cases: number
  readonly deaths: number
}

// const usStates = fs.readFileSync(

// )

const parseToJSON = (usStates: string) =>
  d3.csvParse(usStates).map(row => ({
    date: row.date,
    state: row.state,
    fips: +(row.fips as string),
    cases: +(row.cases as string),
    deaths: +(row.deaths as string)
  })) as unknown as RNEA.ReadonlyNonEmptyArray<Row>

const descanData = (
  json: RNEA.ReadonlyNonEmptyArray<Row>
) =>
  pipe(
    json,
    RNEA.groupBy(row => row.state),
    RR.map(rows => {
      // Prepend an "empty" row in case the first
      // entry for this state is non-empty
      const rows_ = pipe(
        rows,
        RA.prepend({
          ...RNEA.head(rows),
          cases: 0,
          deaths: 0
        })
      )
      return RA.zipWith(rows_, rows, (a, b) => ({
        fips: b.fips,
        date: b.date,
        cases: b.cases - a.cases,
        deaths: b.deaths - a.deaths
      }))
    }),
    RR.collect(Str.Ord)(
      (state, rows): ReadonlyArray<Row> =>
        pipe(
          rows,
          RA.map(row => ({ state, ...row }))
        )
    ),
    RA.flatten,
    RA.sort(
      pipe(
        Str.Ord,
        Ord.contramap((row: Row) => row.date)
      )
    )
  )

const writeFile = (path: string) => (data: string) =>
  TE.tryCatch(
    () => fs.writeFile(path, data),
    error =>
      "Failed to write file\n" + JSON.stringify(error)
  )

const get = (url: string) =>
  TE.tryCatch(
    () => fetch(url).then(res => res.text()),
    error => "Failed to fetch\n" + JSON.stringify(error)
  )

const main = pipe(
  get(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv"
  ),
  TE.map(parseToJSON),
  TE.map(descanData),
  TE.map(JSON.stringify),
  TE.chain(
    writeFile(
      `src/typescript/reduce/us-states-covid-data${new Date().toISOString()}.json`
    )
  ),
  TE.toUnion
)

main().then(console.log)
