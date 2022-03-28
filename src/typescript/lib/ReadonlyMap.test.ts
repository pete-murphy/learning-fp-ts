import * as fc from "fast-check"
import * as Eq from "fp-ts/lib/Eq"
import { constant, constVoid, pipe, tuple } from "fp-ts/lib/function"
import * as N from "fp-ts/lib/number"
import * as O from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import * as Str from "fp-ts/lib/string"

import * as _ from "./ReadonlyMap"

const arbitraryMapTupleNumString: fc.Arbitrary<
  ReadonlyMap<[number, number], string>
> = fc
  .set(fc.integer())
  .map(ns => ns.map(n => tuple(n, 0)))
  .chain(pairs =>
    fc.array(fc.string()).map(strs => new Map(RA.zip(pairs, strs)))
  )

describe("splitLookup", () => {
  describe("unit tests", () => {
    const splitLookup = _.splitLookup(N.Ord)
    const m = new Map([
      [5, "a"],
      [3, "b"],
    ])

    test('splitLookup 2 (fromList [(5,"a"), (3,"b")]) == (empty, Nothing, fromList [(3,"b"), (5,"a")])', () => {
      const actual = splitLookup(2)(m)
      const expected = tuple(
        _.empty,
        O.none,
        new Map([
          [3, "b"],
          [5, "a"],
        ])
      )
      expect(actual).toEqual(expected)
    })

    test('splitLookup 3 (fromList [(5,"a"), (3,"b")]) == (empty, Just "b", singleton 5 "a")', () => {
      const actual = splitLookup(3)(m)
      const expected = tuple(_.empty, O.some("b"), new Map([[5, "a"]]))
      expect(actual).toEqual(expected)
    })

    test('splitLookup 4 (fromList [(5,"a"), (3,"b")]) == (singleton 3 "b", Nothing, singleton 5 "a")', () => {
      const actual = splitLookup(4)(m)
      const expected = tuple(new Map([[3, "b"]]), O.none, new Map([[5, "a"]]))
      expect(actual).toEqual(expected)
    })

    test('splitLookup 5 (fromList [(5,"a"), (3,"b")]) == (singleton 3 "b", Just "a", empty)', () => {
      const actual = splitLookup(5)(m)
      const expected = tuple(new Map([[3, "b"]]), O.some("a"), _.empty)
      expect(actual).toEqual(expected)
    })

    test('splitLookup 6 (fromList [(5,"a"), (3,"b")]) == (fromList [(3,"b"), (5,"a")], Nothing, empty)', () => {
      const actual = splitLookup(6)(m)
      const expected = tuple(
        new Map([
          [3, "b"],
          [5, "a"],
        ]),
        O.none,
        _.empty
      )
      expect(actual).toEqual(expected)
    })
  })

  describe("property tests", () => {
    const ordK = Ord.tuple(N.Ord, N.Ord)
    const splitLookup = _.splitLookup(ordK)
    const union = _.union(ordK)
    const alterAt = _.alterAt(ordK)

    test("original map is recoverable from the return value", () => {
      fc.assert(
        fc.property(
          arbitraryMapTupleNumString,
          fc.tuple(fc.integer(), fc.integer()),
          (m, k) => {
            const [smaller, found, larger] = splitLookup(k)(m)
            const actual = alterAt(k, () => found)(union(smaller, larger))

            expect(actual).toEqual(m)
          }
        )
      )
    })
  })
})

describe("maxView", () => {
  describe("unit tests", () => {
    const maxView = _.maxView(N.Ord)
    const m = new Map([
      [5, "a"],
      [3, "b"],
    ])

    test('maxView (fromList [(5,"a"), (3,"b")]) == Just ("a", singleton 3 "b")', () => {
      const actual = maxView(m)
      const expected = O.some(tuple("a", new Map([[3, "b"]])))
      expect(actual).toEqual(expected)
    })

    test("maxView empty == Nothing", () => {
      const actual = maxView(_.empty)
      const expected = O.none
      expect(actual).toEqual(expected)
    })
  })

  describe("property tests", () => {
    const ordK = Ord.tuple(N.Ord, N.Ord)
    const maxView = _.maxView(ordK)
    const upsertAt = _.upsertAt(ordK)
    const maximum = RA.foldMap(O.getMonoid(Sg.max(ordK)))(
      (ns: readonly [number, number]) => O.of(ns)
    )
    const keys = _.keys(ordK)

    test("original map is recovered from inserting retrieved value at maximum key", () => {
      fc.assert(
        fc.property(arbitraryMapTupleNumString, m => {
          const fromMaxView = maxView(m)

          if (O.isNone(fromMaxView)) {
            expect(m).toEqual(_.empty)
          }
          if (_.isEmpty(m)) {
            expect(fromMaxView).toEqual(O.none)
          }

          pipe(
            O.Do,
            O.apS("fromMaxView", fromMaxView),
            O.apS("maxKey", maximum(keys(m))),
            O.fold(constVoid, ({ maxKey, fromMaxView: [v, m_] }) => {
              const actual = upsertAt(maxKey, v)(m_)

              expect(actual).toEqual(m)
            })
          )
        })
      )
    })
  })
})

describe("maxViewWithKey", () => {
  const maxViewWithKey = _.maxViewWithKey(N.Ord)
  const m = new Map([
    [5, "a"],
    [3, "b"],
  ])

  test('maxViewWithKey (fromList [(5,"a"), (3,"b")]) == Just ((5,"a"), singleton 3 "b")', () => {
    const actual = maxViewWithKey(m)
    const expected = O.some(tuple(tuple(5, "a"), new Map([[3, "b"]])))
    expect(actual).toEqual(expected)
  })

  test("maxViewWithKey empty == Nothing", () => {
    const actual = maxViewWithKey(_.empty)
    const expected = O.none
    expect(actual).toEqual(expected)
  })
})

describe("minView", () => {
  describe("unit tests", () => {
    const minView = _.minView(N.Ord)
    const m = new Map([
      [5, "a"],
      [3, "b"],
    ])

    test('minView (fromList [(5,"a"), (3,"b")]) == Just ((3,"b"), singleton 5 "a")', () => {
      const actual = minView(m)
      const expected = O.some(tuple("b", new Map([[5, "a"]])))
      expect(actual).toEqual(expected)
    })

    test("minView empty == Nothing", () => {
      const actual = minView(_.empty)
      const expected = O.none
      expect(actual).toEqual(expected)
    })
  })

  describe("property tests", () => {
    const ordK = Ord.tuple(N.Ord, N.Ord)
    const minView = _.minView(ordK)
    const upsertAt = _.upsertAt(ordK)
    const minimum = RA.foldMap(O.getMonoid(Sg.min(ordK)))(
      (ns: readonly [number, number]) => O.of(ns)
    )
    const keys = _.keys(ordK)

    test("original map is recovered from inserting retrieved value at minimum key", () => {
      fc.assert(
        fc.property(arbitraryMapTupleNumString, m => {
          const minViewed = minView(m)

          if (O.isNone(minViewed)) {
            expect(m).toEqual(_.empty)
          }
          if (_.isEmpty(m)) {
            expect(minViewed).toEqual(O.none)
          }

          pipe(
            O.Do,
            O.apS("minViewed", minView(m)),
            O.apS("minKey", minimum(keys(m))),
            O.fold(constVoid, ({ minKey, minViewed: [v, m_] }) => {
              const actual = upsertAt(minKey, v)(m_)

              expect(actual).toEqual(m)
            })
          )
        })
      )
    })
  })
})

describe("minViewWithKey", () => {
  const minViewWithKey = _.minViewWithKey(N.Ord)
  const m = new Map([
    [5, "a"],
    [3, "b"],
  ])

  test('minViewWithKey (fromList [(5,"a"), (3,"b")]) == Just ((3,"b"), singleton 5 "a")', () => {
    const actual = minViewWithKey(m)
    const expected = O.some(tuple(tuple(3, "b"), new Map([[5, "a"]])))
    expect(actual).toEqual(expected)
  })

  test("minViewWithKey empty == Nothing", () => {
    const actual = minViewWithKey(_.empty)
    const expected = O.none
    expect(actual).toEqual(expected)
  })
})

describe("alterAt", () => {
  const alterAt = _.alterAt(N.Ord)
  const constNone = constant<O.Option<string>>(O.none)
  const constJustC = constant(O.some("c"))
  const m = new Map([
    [5, "a"],
    [3, "b"],
  ])

  // @NOTE - Pete Murphy 2021-05-17 - These test cases are lifted from the unit
  // tests for the Haskell `containers` library.
  test('alter (const Nothing) 7 (fromList [(5,"a"), (3,"b")]) == fromList [(3, "b"), (5, "a")]', () => {
    const actual = alterAt(7, constNone)(m)
    const expected = new Map([
      [5, "a"],
      [3, "b"],
    ])
    expect(actual).toEqual(expected)
  })

  test('alter (const Nothing) 5 (fromList [(5,"a"), (3,"b")]) == singleton 3 "b"', () => {
    const actual = alterAt(5, constNone)(m)
    const expected = new Map([[3, "b"]])
    expect(actual).toEqual(expected)
  })

  test('alter (const (Just "c")) 7 (fromList [(5,"a"), (3,"b")]) == fromList [(3, "b"), (5, "a"), (7, "c")]', () => {
    const actual = alterAt(7, constJustC)(m)
    const expected = new Map([
      [3, "b"],
      [5, "a"],
      [7, "c"],
    ])
    expect(actual).toEqual(expected)
  })

  test('alter (const (Just "c")) 5 (fromList [(5,"a"), (3,"b")]) == fromList [(3, "b"), (5, "c")]', () => {
    const actual = alterAt(5, constJustC)(m)
    const expected = new Map([
      [3, "b"],
      [5, "c"],
    ])
    expect(actual).toEqual(expected)
  })
})

describe("unions", () => {
  const unionsRA = _.unions(N.Eq, RA.Foldable)
  const m1 = new Map([
    [5, "a"],
    [3, "b"],
  ])
  const m2 = new Map([
    [5, "A"],
    [7, "C"],
  ])
  const m3 = new Map([
    [5, "A3"],
    [3, "B3"],
  ])

  test('unions [(fromList [(5, "a"), (3, "b")]), (fromList [(5, "A"), (7, "C")]), (fromList [(5, "A3"), (3, "B3")])]\n\
     == fromList [(3, "b"), (5, "a"), (7, "C")]', () => {
    const actual = unionsRA([m1, m2, m3])
    const expected = new Map([
      [3, "b"],
      [5, "a"],
      [7, "C"],
    ])
    expect(actual).toEqual(expected)
  })

  test('unions [(fromList [(5, "A3"), (3, "B3")]), (fromList [(5, "A"), (7, "C")]), (fromList [(5, "a"), (3, "b")])]\n\
     == fromList [(3, "B3"), (5, "A3"), (7, "C")]', () => {
    const actual = unionsRA([m3, m2, m1])
    const expected = new Map([
      [3, "B3"],
      [5, "A3"],
      [7, "C"],
    ])
    expect(actual).toEqual(expected)
  })
})

describe("union", () => {
  describe("unit tests", () => {
    const union = _.union(N.Eq)
    const m1 = new Map([
      [5, "a"],
      [3, "b"],
    ])
    const m2 = new Map([
      [5, "A"],
      [7, "C"],
    ])

    test('union (fromList [(5, "a"), (3, "b")]) (fromList [(5, "A"), (7, "C")]) == fromList [(3, "b"), (5, "a"), (7, "C")]', () => {
      const actual = union(m1, m2)
      const expected = new Map([
        [3, "b"],
        [5, "a"],
        [7, "C"],
      ])
      expect(actual).toEqual(expected)
    })
  })

  describe("property tests", () => {
    const union = _.union(Eq.tuple(N.Eq, N.Eq))
    const upsertAt = _.upsertAt(Eq.tuple(N.Eq, N.Eq))

    test("union is associative", () => {
      fc.assert(
        fc.property(
          arbitraryMapTupleNumString,
          arbitraryMapTupleNumString,
          arbitraryMapTupleNumString,
          (m1, m2, m3) => {
            const right = union(m1, union(m2, m3))
            const left = union(union(m1, m2), m3)

            expect(left).toEqual(right)
          }
        )
      )
    })

    test("union of singleton and some map is same as inserting into map", () => {
      fc.assert(
        fc.property(
          fc.tuple(fc.integer(), fc.integer()),
          fc.string(),
          arbitraryMapTupleNumString,
          (k, v, m) => {
            const unioned = union(_.singleton(k, v), m)
            const upserted = upsertAt(k, v)(m)

            expect(unioned).toEqual(upserted)
          }
        )
      )
    })
  })
})

describe("lookupLE", () => {
  describe("unit tests", () => {
    const lookupLE = _.lookupLE(N.Ord)
    const m = new Map([
      [5, "a"],
      [3, "b"],
    ])

    test('lookupLE 2 (fromList [(5, "a"), (3, "b")]) == Nothing', () => {
      const actual = lookupLE(2)(m)
      const expected = O.none

      expect(actual).toEqual(expected)
    })

    test('lookupLE 3 (fromList [(5, "a"), (3, "b")]) == Just "b"', () => {
      const actual = lookupLE(3)(m)
      const expected = O.some("b")

      expect(actual).toEqual(expected)
    })

    test('lookupLE 4 (fromList [(5, "a"), (3, "b")]) == Just "b"', () => {
      const actual = lookupLE(4)(m)
      const expected = O.some("b")

      expect(actual).toEqual(expected)
    })

    test('lookupLE 5 (fromList [(5, "a"), (3, "b")]) == Just "a"', () => {
      const actual = lookupLE(5)(m)
      const expected = O.some("a")

      expect(actual).toEqual(expected)
    })

    test('lookupLE 6 (fromList [(5, "a"), (3, "b")]) == Just "a"', () => {
      const actual = lookupLE(6)(m)
      const expected = O.some("a")

      expect(actual).toEqual(expected)
    })
  })

  describe("property tests", () => {
    const ordK = Ord.tuple(N.Ord, N.Ord)
    const lookupLE = _.lookupLE(ordK)
    const leq = Ord.leq(ordK)

    test("same as converting to array and taking last value where key is less than or equal to k", () => {
      fc.assert(
        fc.property(
          fc.tuple(fc.integer(), fc.integer()),
          arbitraryMapTupleNumString,
          (k, m) => {
            const vOption = lookupLE(k)(m)

            pipe(
              m,
              _.toReadonlyArray(ordK),
              RA.takeLeftWhile(([k_, _]) => leq(k_, k)),
              RA.last,
              O.map(([_, v]) => v),
              vOption_ => {
                expect(vOption_).toEqual(vOption)
              }
            )
          }
        )
      )
    })
  })
})

describe("splitLookupLE", () => {
  describe("property tests", () => {
    const ordK = Ord.tuple(N.Ord, N.Ord)
    const splitLookupLE = _.splitLookupLE(ordK)
    const eqOptStr = O.getEq(Str.Eq).equals

    test("smaller map should always be empty if lookup fails", () => {
      fc.assert(
        fc.property(
          fc.tuple(fc.integer(), fc.integer()),
          arbitraryMapTupleNumString,
          (k, m) => {
            const [smaller, x, _larger] = splitLookupLE(k)(m)

            fc.pre(eqOptStr(x, O.none))

            expect(smaller).toEqual(_.empty)
          }
        )
      )
    })
  })
})
