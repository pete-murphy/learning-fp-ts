import * as fc from "fast-check"
import { createCoord, createCoord_ } from "./coords"

describe("createCoord", () => {
  it("is same as createCoord_", () => {
    fc.assert(
      fc.property(fc.integer(1, 20), n => {
        expect(createCoord(n)).toEqual(createCoord_(n))
      })
    )
  })
})
