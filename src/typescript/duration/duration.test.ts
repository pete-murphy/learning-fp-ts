import fc from "fast-check"
import {
  isValidDuration,
  sanitizeDuration,
  durationToSeconds,
  formatDurationSeconds,
  DurationUnit,
} from "./duration.ignore"

describe("isValidDuration", () => {
  const passing = [
    ["1d", true],
    ["1h", true],
    ["1m", true],
    ["1h 15m", true],
    ["1d 15h", true],
    ["1d 1h 15m", true],
  ]

  test.each(passing)("%p is valid", (actual, expected) => {
    expect(isValidDuration(actual as string)).toEqual(expected)
  })

  const failing = [
    ["60m", false],
    ["24h", false],
    ["0s 1d 1m", false],
    ["1h 1d", false],
  ]

  test.each(failing)("%p is NOT valid", (actual, expected) => {
    expect(isValidDuration(actual as string)).toEqual(expected)
  })
})

describe("sanitizeDuration", () => {
  const failing = [
    ["1h 0m", "1h"],
    ["1d 0h 0m", "1d"],
    ["0d 1h 5m", "1h 5m"],
    ["0m", "0s"],
    ["0h 1m", "1m"],
    ["0d 15h", "15h"],
  ]

  test.each(failing)("%p becomes %p", (actual, expected) => {
    expect(sanitizeDuration(actual)).toEqual(expected)
  })
})

describe("durationToSeconds", () => {
  const failing = [
    ["6m", 60 * 6],
    ["1h 6m", 66 * 60],
    ["2d 2h 2m", 2 * 24 * 60 * 60 + 2 * 60 * 60 + 2 * 60],
    ["1d 6m", 24 * 60 * 60 + 6 * 60],
    ["1d 6h", 24 * 60 * 60 + 6 * 60 * 60],
  ]

  test.each(failing)("%p is %p seconds", (actual, expected) => {
    expect(durationToSeconds(actual as string)).toEqual(expected)
  })
})

const arbitraryDurationUnit = (): fc.Arbitrary<DurationUnit> =>
  fc.oneof(
    fc.constant(DurationUnit.Days),
    fc.constant(DurationUnit.Hours),
    fc.constant(DurationUnit.Minutes),
    fc.constant(DurationUnit.Seconds)
  )

// Property-tests
describe("properties", () => {
  describe("formatting and then parsing is a round trip", () => {
    fc.assert(
      fc.property(fc.nat(), n => {
        return durationToSeconds(formatDurationSeconds(n)) === n
      })
    )
  })

  describe("formatDuration makes a valid duration", () => {
    fc.assert(
      fc.property(fc.nat(), n => {
        return isValidDuration(
          sanitizeDuration(formatDurationSeconds(n))
        )
      })
    )
  })
})
