import { pipe, TE, RTE, RA } from "./lib/fp-ts-imports"

const analyzeColumn = RA.reduceWithIndex(
  { legit: true, target: -1, rows: [] },
  (
    index,
    {
      rows,
      legit,
      target
    }: {
      rows: { units: number; index: number }[]
      legit: boolean
      target: number
    },
    row: number[]
  ) => {
    const units = row.reduce((acc, v) => acc + v, 0)
    return {
      rows: [...rows, { units, index }],
      legit: legit && (target === -1 || target === units),
      target:
        target === -1 ? units : Math.max(target, units)
    }
  }
)

analyzeColumn([
  [1, 2, 3],
  [4, 5, 6]
]) //?

const columnify = (input: number[][]): number[][][] => {
  let slices = new Array<[number, number]>(
    input.length
  ).fill([0, 1])
  const lengths = input.map(v => v.length)

  let acc: number[][][] = []

  const slicesRemaining = () =>
    !pipe(
      RA.zip(slices)(lengths),
      RA.reduce(
        true,
        (acc, [length, [start]]) =>
          acc && start > length - 1
      )
    )

  while (slicesRemaining()) {
    pipe(
      slices,
      RA.mapWithIndex((rowIndex, [start, end]) =>
        input[rowIndex].slice(start, end)
      ),
      column =>
        pipe(
          column,
          analyzeColumn,
          ({ rows, legit, target }) => {
            if (legit) {
              acc = [...acc, RA.toArray(column)]
              slices = slices.map(([end]) => [end, end + 1])
            } else {
              slices = slices.map(([start, end], i) =>
                rows[i].units === target
                  ? [start, end]
                  : [start, end + 1]
              )
            }
          }
        )
    )
  }

  return pipe(acc, transpose)
}
