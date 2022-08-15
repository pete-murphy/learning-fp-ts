// findMapM ::
//   forall m x y .
//   Monad m =>
//   Array x ->
//   (x -> m (Maybe y)) ->
//   m (Maybe y)
// findMapM xs p = do
//   result <- runExceptT do
//     xs # traverse_ \x -> ExceptT do
//       p x <#> case _ of
//         Just y -> Left (Just y)
//         Nothing -> Right unit
//   case result of
//     Left v -> pure v
//     Right _ -> pure Nothing

import { B, E, flow, identity, O, pipe, RNEA, T, TE } from "./lib/fp-ts-imports"

const findMapM: <A, B>(
  p: (a: A) => T.Task<O.Option<B>>
) => (xs: ReadonlyArray<A>) => T.Task<O.Option<B>> = p =>
  flow(
    TE.traverseSeqArray(
      flow(
        p,
        T.map(
          O.match(
            () => E.of(void 0),
            y => E.throwError(O.some(y))
          )
        )
      )
    ),
    T.map(E.match(identity, _ => O.none))
  )

const findM: <A>(
  p: (a: A) => T.Task<boolean>
) => (xs: ReadonlyArray<A>) => T.Task<O.Option<A>> = p =>
  findMapM(x =>
    pipe(
      p(x),
      T.map(
        B.match(
          () => O.none,
          () => O.of(x)
        )
      )
    )
  )

const main = async () => {
  const xs = RNEA.range(1, 2_000)

  console.time("findM")
  await pipe(
    xs,
    findM(n => {
      console.log(n)
      return pipe(T.delay(n * 100)(T.of(n === 2)))
    })
  )()
  console.timeEnd("findM")
}

main()

// findM ::
//   forall m x .
//   Monad m =>
//   Array x ->
//   (x -> m Boolean) ->
//   m (Maybe x)
// findM xs p =
//   findMapM xs \x -> p x <#> case _ of
//     true -> Just x
//     false -> Nothing
