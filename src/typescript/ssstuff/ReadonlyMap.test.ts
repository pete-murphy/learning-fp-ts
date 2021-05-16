import * as _ from "./ReadonlyMap"
import * as N from "fp-ts/number"
import * as RA from "fp-ts/ReadonlyArray"
import * as O from "fp-ts/Option"
import * as Ord from "fp-ts/Ord"
import * as Sg from "fp-ts/Semigroup"
import * as Eq from "fp-ts/Eq"
import { constant, pipe, tuple } from "fp-ts/function"
import * as fc from "fast-check"

const mk = _.fromFoldable(N.Ord, Sg.first<string>(), RA.Foldable)

const mkTupN = _.fromFoldable(
  Ord.tuple(N.Ord, N.Ord),
  Sg.first<string>(),
  RA.Foldable
)

const arbitraryMapTupleNumString: fc.Arbitrary<
  ReadonlyMap<[number, number], string>
> = fc
  .set(fc.integer())
  .map(ns => ns.map(n => tuple(n, 0)))
  .chain(pairs =>
    fc.array(fc.string()).map(strs => new Map(RA.zip(pairs, strs)))
  )

describe("splitLookup", () => {
  const splitLookup = _.splitLookup(N.Ord)
  const m = mk([
    [5, "a"],
    [3, "b"],
  ])

  it('splitLookup 2 (fromList [(5,"a"), (3,"b")]) == (empty, Nothing, fromList [(3,"b"), (5,"a")])', () => {
    const actual = splitLookup(2)(m)
    const expected = tuple(
      _.empty,
      O.none,
      mk([
        [3, "b"],
        [5, "a"],
      ])
    )
    expect(actual).toEqual(expected)
  })

  it('splitLookup 3 (fromList [(5,"a"), (3,"b")]) == (empty, Just "b", singleton 5 "a")', () => {
    const actual = splitLookup(3)(m)
    const expected = tuple(_.empty, O.some("b"), mk([[5, "a"]]))
    expect(actual).toEqual(expected)
  })

  it('splitLookup 4 (fromList [(5,"a"), (3,"b")]) == (singleton 3 "b", Nothing, singleton 5 "a")', () => {
    const actual = splitLookup(4)(m)
    const expected = tuple(mk([[3, "b"]]), O.none, mk([[5, "a"]]))
    expect(actual).toEqual(expected)
  })

  it('splitLookup 5 (fromList [(5,"a"), (3,"b")]) == (singleton 3 "b", Just "a", empty)', () => {
    const actual = splitLookup(5)(m)
    const expected = tuple(mk([[3, "b"]]), O.some("a"), _.empty)
    expect(actual).toEqual(expected)
  })

  it('splitLookup 6 (fromList [(5,"a"), (3,"b")]) == (fromList [(3,"b"), (5,"a")], Nothing, empty)', () => {
    const actual = splitLookup(6)(m)
    const expected = tuple(
      mk([
        [3, "b"],
        [5, "a"],
      ]),
      O.none,
      _.empty
    )
    expect(actual).toEqual(expected)
  })
})

describe("maxView", () => {
  const maxView = _.maxView(N.Ord)
  const m = mk([
    [5, "a"],
    [3, "b"],
  ])

  it('maxView (fromList [(5,"a"), (3,"b")]) == Just ("a", singleton 3 "b")', () => {
    const actual = maxView(m)
    const expected = O.some(tuple("a", mk([[3, "b"]])))
    expect(actual).toEqual(expected)
  })

  it("maxView empty == Nothing", () => {
    const actual = maxView(_.empty)
    const expected = O.none
    expect(actual).toEqual(expected)
  })
})

describe("maxViewWithKey", () => {
  const maxViewWithKey = _.maxViewWithKey(N.Ord)
  const m = mk([
    [5, "a"],
    [3, "b"],
  ])

  it('maxViewWithKey (fromList [(5,"a"), (3,"b")]) == Just ((5,"a"), singleton 3 "b")', () => {
    const actual = maxViewWithKey(m)
    const expected = O.some(tuple(tuple(5, "a"), mk([[3, "b"]])))
    expect(actual).toEqual(expected)
  })

  it("maxViewWithKey empty == Nothing", () => {
    const actual = maxViewWithKey(_.empty)
    const expected = O.none
    expect(actual).toEqual(expected)
  })
})

describe("minView", () => {
  const minView = _.minView(N.Ord)
  const m = mk([
    [5, "a"],
    [3, "b"],
  ])

  it('minView (fromList [(5,"a"), (3,"b")]) == Just ((3,"b"), singleton 5 "a")', () => {
    const actual = minView(m)
    const expected = O.some(tuple("b", mk([[5, "a"]])))
    expect(actual).toEqual(expected)
  })

  it("minView empty == Nothing", () => {
    const actual = minView(_.empty)
    const expected = O.none
    expect(actual).toEqual(expected)
  })
})

describe("minViewWithKey", () => {
  const minViewWithKey = _.minViewWithKey(N.Ord)
  const m = mk([
    [5, "a"],
    [3, "b"],
  ])

  it('minViewWithKey (fromList [(5,"a"), (3,"b")]) == Just ((3,"b"), singleton 5 "a")', () => {
    const actual = minViewWithKey(m)
    const expected = O.some(tuple(tuple(3, "b"), mk([[5, "a"]])))
    expect(actual).toEqual(expected)
  })

  it("minViewWithKey empty == Nothing", () => {
    const actual = minViewWithKey(_.empty)
    const expected = O.none
    expect(actual).toEqual(expected)
  })
})

describe("alter", () => {
  const alter = _.alter(N.Ord)
  const constNone = constant<O.Option<string>>(O.none)
  const constJustC = constant(O.some("c"))
  const m = mk([
    [5, "a"],
    [3, "b"],
  ])

  it('alter (const Nothing) 7 (fromList [(5,"a"), (3,"b")]) == fromList [(3, "b"), (5, "a")]', () => {
    const actual = alter(constNone)(7)(m)
    const expected = mk([
      [5, "a"],
      [3, "b"],
    ])
    expect(actual).toEqual(expected)
  })

  it('alter (const Nothing) 5 (fromList [(5,"a"), (3,"b")]) == singleton 3 "b"', () => {
    const actual = alter(constNone)(5)(m)
    const expected = mk([[3, "b"]])
    expect(actual).toEqual(expected)
  })

  it('alter (const (Just "c")) 7 (fromList [(5,"a"), (3,"b")]) == fromList [(3, "b"), (5, "a"), (7, "c")]', () => {
    const actual = alter(constJustC)(7)(m)
    const expected = mk([
      [3, "b"],
      [5, "a"],
      [7, "c"],
    ])
    expect(actual).toEqual(expected)
  })

  it('alter (const (Just "c")) 5 (fromList [(5,"a"), (3,"b")]) == fromList [(3, "b"), (5, "c")]', () => {
    const actual = alter(constJustC)(5)(m)
    const expected = mk([
      [3, "b"],
      [5, "c"],
    ])
    expect(actual).toEqual(expected)
  })
})

describe("readonlyArrayUnions", () => {
  const readonlyArrayUnions = _.readonlyArrayUnions(N.Eq)
  const m1 = mk([
    [5, "a"],
    [3, "b"],
  ])
  const m2 = mk([
    [5, "A"],
    [7, "C"],
  ])
  const m3 = mk([
    [5, "A3"],
    [3, "B3"],
  ])

  it('unions [(fromList [(5, "a"), (3, "b")]), (fromList [(5, "A"), (7, "C")]), (fromList [(5, "A3"), (3, "B3")])]\n\
     == fromList [(3, "b"), (5, "a"), (7, "C")]', () => {
    const actual = readonlyArrayUnions([m1, m2, m3])
    const expected = mk([
      [3, "b"],
      [5, "a"],
      [7, "C"],
    ])
    expect(actual).toEqual(expected)
  })

  it('unions [(fromList [(5, "A3"), (3, "B3")]), (fromList [(5, "A"), (7, "C")]), (fromList [(5, "a"), (3, "b")])]\n\
     == fromList [(3, "B3"), (5, "A3"), (7, "C")]', () => {
    const actual = readonlyArrayUnions([m3, m2, m1])
    const expected = mk([
      [3, "B3"],
      [5, "A3"],
      [7, "C"],
    ])
    expect(actual).toEqual(expected)
  })

  test("same as reduce with union", () => {
    const readonlyArrayUnionsTup = _.readonlyArrayUnions(Eq.tuple(N.Eq, N.Eq))
    const union = _.union(Eq.tuple(N.Eq, N.Eq))
    const empty = <A>(): ReadonlyMap<readonly [number, number], A> => _.empty

    fc.assert(
      fc.property(fc.array(arbitraryMapTupleNumString), ms => {
        const actual = readonlyArrayUnionsTup(ms)
        const expected = pipe(ms, RA.reduce(empty(), union))

        expect(actual).toEqual(expected)
      })
    )
  })
})

describe("union", () => {
  it('union (fromList [(5, "a"), (3, "b")]) (fromList [(5, "A"), (7, "C")]) == fromList [(3, "b"), (5, "a"), (7, "C")]', () => {
    const union = _.union(N.Eq)
    const m1 = mk([
      [5, "a"],
      [3, "b"],
    ])
    const m2 = mk([
      [5, "A"],
      [7, "C"],
    ])

    const actual = union(m1, m2)
    const expected = mk([
      [3, "b"],
      [5, "a"],
      [7, "C"],
    ])
    expect(actual).toEqual(expected)
  })

  it("union is associative", () => {
    const union = _.union(Eq.tuple(N.Eq, N.Eq))
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

  it("union of singleton and some map is same as inserting into map", () => {
    const union = _.union(Eq.tuple(N.Eq, N.Eq))
    const insert = _.upsertAt(Eq.tuple(N.Eq, N.Eq))
    fc.assert(
      fc.property(
        fc.tuple(fc.integer(), fc.integer()),
        fc.string(),
        arbitraryMapTupleNumString,
        (k, v, m) => {
          const unioned = union(_.singleton(k, v), m)
          const inserted = insert(k, v)(m)
          expect(unioned).toEqual(inserted)
        }
      )
    )
  })
})

describe("lookupLE", () => {
  const lookupLE = _.lookupLE(N.Ord)
  const m = mk([
    [5, "a"],
    [3, "b"],
  ])

  const ordTup = Ord.tuple(N.Ord, N.Ord)
  const lookupLETup = _.lookupLE(ordTup)
  const leqTup = Ord.leq(ordTup)

  it('lookupLE 2 (fromList [(5, "a"), (3, "b")]) == Nothing', () => {
    const actual = lookupLE(2)(m)
    const expected = O.none

    expect(actual).toEqual(expected)
  })

  it('lookupLE 3 (fromList [(5, "a"), (3, "b")]) == Just "b"', () => {
    const actual = lookupLE(3)(m)
    const expected = O.some("b")

    expect(actual).toEqual(expected)
  })

  it('lookupLE 4 (fromList [(5, "a"), (3, "b")]) == Just "b"', () => {
    const actual = lookupLE(4)(m)
    const expected = O.some("b")

    expect(actual).toEqual(expected)
  })

  it('lookupLE 5 (fromList [(5, "a"), (3, "b")]) == Just "a"', () => {
    const actual = lookupLE(5)(m)
    const expected = O.some("a")

    expect(actual).toEqual(expected)
  })

  it('lookupLE 6 (fromList [(5, "a"), (3, "b")]) == Just "a"', () => {
    const actual = lookupLE(6)(m)
    const expected = O.some("a")

    expect(actual).toEqual(expected)
  })

  it("same as converting to array and taking last value where key is less than or equal to k", () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.integer(), fc.integer()),
        arbitraryMapTupleNumString,
        (k, m) => {
          const vOption = lookupLETup(k)(m)

          pipe(
            m,
            _.toReadonlyArray(ordTup),
            RA.takeLeftWhile(([k_, _]) => leqTup(k_, k)),
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
