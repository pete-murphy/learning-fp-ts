// This library provides efficient left folds that you can combine using `Applicative` style.
import * as L from "fp-ts-foldl";
import { pipe } from "fp-ts/function";
import * as N from "fp-ts/number";
import * as RA from "fp-ts/ReadonlyArray";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as RR from "fp-ts/ReadonlyRecord";

// Sample dataset to be used later
import { flowers, Flower } from "./flowers";

// Use `fold` to apply a `Fold` to a `ReadonlyArray`
L.fold(RA.Foldable)(L.sum)([1, 2, 3]); //-> 6

// `fold` works with any `Foldable` type, but we can use `foldArray` for the common case of use with array
L.foldArray(L.sum)([1, 2, 3]);

// `Fold`s are `Applicative`s, so you can combine them using `Applicative` combinators:
const average = pipe(
  L.Do,
  L.apS("sum", L.sum),
  L.apSW("length", L.length),
  L.map(({ sum, length }) => sum / length)
);

// Taking the sum, the sum of squares, ..., up to the sum of x^5
const powerSums = pipe(
  [1, 2, 3, 4, 5],
  RA.traverse(L.Applicative)(n =>
    pipe(
      L.sum,
      L.premap((x: number) => x ** n)
    )
  )
);
L.foldArray(powerSums)(RNEA.range(1, 10));
//-> [ 55, 385, 3025, 25333, 220825 ]

// These combined folds will still traverse the array only once:
L.foldArray(average)(RNEA.range(1, 10_000_000));
//-> 5000000.5

pipe(
  RNEA.range(1, 10_000_000),
  L.foldArray(
    L.Do,
    L.apS("minimum", L.minimum(N.Ord)),
    L.apS("maximum", L.maximum(N.Ord))
  )
);
//-> { minimum: O.some(1), maximum: O.some(10_000_000) }

/*
Now that we have the basics, let's look at [a dataset](https://archive.ics.uci.edu/ml/datasets/iris) of `Flower` measurements.

```ts
type Flower = {
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
  species: "setosa" | "versicolor" | "virginica";
};

const flowers = [
  {
    sepalLength: 5.1,
    sepalWidth: 3.5,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: "setosa"
  },
  {
    sepalLength: 4.9,
    sepalWidth: 3,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: "setosa"
  },
  {
    sepalLength: 4.7,
    sepalWidth: 3.2,
    petalLength: 1.3,
    petalWidth: 0.2,
    species: "setosa"
  },
  // ...
]
```
 */

// We can get the mean petal-length of all flowers
pipe(
  flowers,
  L.foldArray(
    L.mean,
    L.premap((flower: Flower) => flower.petalLength),
    L.map(n => n.toPrecision(3)) // `map` transforms the final result of the `Fold`
  )
); //-> "3.76"

// We can also use `prefilter` to just look at the petal-lengths of the "virginica" species
pipe(
  flowers,
  L.foldArray(
    L.mean,
    L.premap((flower: Flower) => flower.petalLength),
    L.prefilter(flower => flower.species === "virginica"),
    L.map(n => n.toPrecision(3))
  )
); //-> "5.55"

// Finally we can use `Applicative` combinators to get the standard deviation of
// all flower attributes, while only traversing the array once
pipe(
  flowers,
  L.foldArray(
    L.Do,
    L.apS(
      "petalLength",
      pipe(
        L.std,
        L.premap((flower: Flower) => flower.petalLength)
      )
    ),
    L.apS(
      "petalWidth",
      pipe(
        L.std,
        L.premap(flower => flower.petalWidth)
      )
    ),
    L.apS(
      "sepalLength",
      pipe(
        L.std,
        L.premap(flower => flower.sepalLength)
      )
    ),
    L.apS(
      "sepalWidth",
      pipe(
        L.std,
        L.premap(flower => flower.sepalWidth)
      )
    ),
    L.map(RR.map(n => n.toPrecision(3)))
  )
);
//-> { petalLength: '1.76', petalWidth: '0.761', sepalLength: '0.825', sepalWidth: '0.432' }
