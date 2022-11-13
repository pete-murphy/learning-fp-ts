import {
  readonlyArray as RA,
  number as N,
  option as O,
  readonlyRecord as RR,
  readonlyTuple as RT
} from "fp-ts";
import { pipe } from "fp-ts/function";
import * as L from "fp-ts-foldl";

type IncomeStatementRow = {
  readonly year: number;
  readonly revenues: number;
  readonly cogs: number;
  readonly salesExpenses: number;
};

type YearSpan = readonly [start: number, end: number];

const compoundAnnualGrowthOver = (
  numberOfYears: number
): L.Fold<number, number> =>
  pipe(
    L.struct({ start: L.headOrElse(() => 0), end: L.lastOrElse(() => 0) }),
    L.map(({ start, end }) => (end / start) ** (1 / numberOfYears) - 1)
  );

const summaryForFieldOver =
  (numberOfYears: number) => (field: keyof IncomeStatementRow) =>
    pipe(
      L.struct({
        average: L.mean,
        compoundAnnualGrowth: compoundAnnualGrowthOver(numberOfYears),
        min: pipe(L.minimum(N.Ord), L.map(O.getOrElse(() => 0))),
        max: pipe(L.maximum(N.Ord), L.map(O.getOrElse(() => 0)))
      }),
      L.premap((row: IncomeStatementRow) => row[field])
    );

const summaryForYearSpan = ([start, end]: YearSpan) => {
  const summaryForField = summaryForFieldOver(end - start);
  return pipe(
    L.struct({
      revenues: summaryForField("revenues"),
      cogs: summaryForField("cogs"),
      salesExpenses: summaryForField("salesExpenses")
    }),
    L.prefilter(row => row.year >= start && row.year <= end)
  );
};

// TODO: There's probably a way to simplify this
const summaryForYearSpans = (yearSpans: ReadonlyArray<YearSpan>) =>
  pipe(
    yearSpans,
    RA.traverse(L.Applicative)(yearSpan =>
      RT.sequence(L.Applicative)([summaryForYearSpan(yearSpan), yearSpan])
    ),
    L.map(RA.map(([summary, span]) => [span.join("–"), summary] as const)),
    L.map(RR.fromEntries)
  );

const data: ReadonlyArray<IncomeStatementRow> = [
  {
    year: 2018,
    revenues: 18_000,
    cogs: 8_500,
    salesExpenses: 4_000
  },
  {
    year: 2019,
    revenues: 23_000,
    cogs: 10_000,
    salesExpenses: 4_000
  },
  {
    year: 2020,
    revenues: 23_500,
    cogs: 12_000,
    salesExpenses: 4_500
  },
  {
    year: 2021,
    revenues: 22_000,
    cogs: 10_000,
    salesExpenses: 4_000
  },
  {
    year: 2022,
    revenues: 23_000,
    cogs: 10_000,
    salesExpenses: 4_000
  }
];

const summary = pipe(
  data,
  L.foldArray(
    summaryForYearSpans([
      [2018, 2019],
      [2018, 2022],
      [2021, 2022]
    ])
  )
);
