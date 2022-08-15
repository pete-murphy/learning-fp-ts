import { N, O, pipe, RNEA, Str } from "./lib/fp-ts-imports"

export type RetryPolicyParams = {
  /** Milliseconds */
  readonly maxDelay: number
  readonly maxAttempts: number
}

/**
 * A simplified "retry policy" which is used to determine whether a connection
 * attempt should be retried, and how long to wait in between connection
 * attempts.
 */
export type RetryPolicy = (retryAttempts: number) => O.Option<number>

const mkRetryPolicy: (params: RetryPolicyParams) => RetryPolicy =
  params => attemptCount =>
    attemptCount >= params.maxAttempts
      ? O.none
      : O.some(
          attemptCount **
            (Math.log(params.maxDelay) / Math.log(params.maxAttempts - 1))
        )
// const fn = (a, d) => a ** (Math.log(d) / Math.log(a))

export const exampleRetryPolicy: RetryPolicy = retryAttempts =>
  retryAttempts >= 10 ? O.none : O.some(retryAttempts ** 1.4 * 1_000)
// export const exampleRetryPolicy: RetryPolicy = retryAttempts =>
//   retryAttempts >= 10 ? O.none : O.some(retryAttempts ** 1.4 * 1_000)

9 ** 1.4 //?
Math.log(21.6) / Math.log(9) //?
9 ** (Math.log(21.6) / Math.log(9)) //?
Math.log(21.6) / Math.log(9) //?

// const getExp = (maxAttempts:number, maxDelay) => maxAttempts ** x ==

/*
Solve for `x`

```
maxDelay = maxAttempts ** x
```

take the x-root
```
maxDelay ** (1/x) = (maxAttempts ** x) ** (1/x)
```

haha, whoops no, actually take Math.logBase(maxAttempts) of both sides
```
Math.logBase(maxAttempts, maxDelay) = Math.logBase(maxAttempts, maxAttempts ** x)
                                    = Math.logBase(maxAttempts, maxAttempts) * x
                                    = 1 * x
                                    = x
```

but we don't have Math.logBase in JS :\ ... however this is actually the same as
```
Math.log(21.6) / Math.log(9) //?
```



*/

pipe(
  RNEA.range(0, 12),
  RNEA.map(mkRetryPolicy({ maxAttempts: 10, maxDelay: 23_000 })),
  RNEA.map(O.map(x => (x / 1000).toFixed(3))),
  RNEA.map(O.getShow(Str.Show).show)
) //?
