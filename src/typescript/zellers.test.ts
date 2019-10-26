import * as fc from "fast-check";
import {
  toJSDay,
  zellersCongruence,
  zellerInputsFromYMD,
  ymdFromDate
} from "./zellers";

describe("Zeller's congruence", () => {
  test("Returns same day as Date.prototype.getDay()", () => {
    fc.assert(
      fc.property(fc.date(), d => {
        const received = toJSDay(
          zellersCongruence(zellerInputsFromYMD(...ymdFromDate(d)))
        );
        console.log(d.toLocaleDateString());
        const expected = d.getDay();
        expect(received).toEqual(expected);
      })
    );
  });
});
