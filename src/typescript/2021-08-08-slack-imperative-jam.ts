import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as TE from "fp-ts/lib/TaskEither"
import * as NEA from "fp-ts/lib/NonEmptyArray"
import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"

type Strawberry = { tag: "Strawberry" }
type SugarPot = { tag: "SugarPot" }

type KitchenConnection = {
  fetchFromFridge: <T>(size: "small" | "big") => Promise<T[]>
  cookInPot: (thingsToCook: unknown) => Promise<void>
}

type Smartphone = {
  notifyFriends: (message: string) => Promise<void>
}

const fetchStrawberriesRTE =
  (
    size: "small" | "big"
  ): RTE.ReaderTaskEither<KitchenConnection, Error, Strawberry[]> =>
  (kitchenConnection: KitchenConnection) =>
    TE.tryCatch(
      () => kitchenConnection.fetchFromFridge<Strawberry>(size),
      E.toError
    )

const makeJamRTE =
  (
    strawberriesWithSugarPots: NEA.NonEmptyArray<{
      strawberry: Strawberry
      sugarPot: SugarPot
    }>
  ): RTE.ReaderTaskEither<KitchenConnection, Error, void> =>
  (kitchenConnection: KitchenConnection) =>
    TE.tryCatch(
      () => kitchenConnection.cookInPot(strawberriesWithSugarPots),
      E.toError
    )

const notifyFriendsRTE =
  (message: string): RTE.ReaderTaskEither<Smartphone, Error, void> =>
  ({ notifyFriends }: Smartphone) =>
    TE.tryCatch(() => notifyFriends(message), E.toError)

const mixStrawberriesAndSugar = (
  strawberries: Strawberry[],
  sugarPots: SugarPot[]
): O.Option<
  NEA.NonEmptyArray<{ strawberry: Strawberry; sugarPot: SugarPot }>
> => {
  const strawberriesAndSugar = A.zipWith(
    strawberries,
    sugarPots,
    (strawberry, sugarPot) => ({ strawberry, sugarPot })
  )
  return NEA.fromArray(strawberriesAndSugar)
}

type MakeStrawberryJamRTEDeps = KitchenConnection & Smartphone

const makeStrawberryJamRTE = (
  sugarPots: SugarPot[]
): RTE.ReaderTaskEither<
  MakeStrawberryJamRTEDeps,
  Error,
  { jamPotCount: number }
> =>
  pipe(
    // Step 1: fetch strawberries
    fetchStrawberriesRTE("small"),
    // Step 2: Mix with sugar
    RTE.chainW(strawberries =>
      pipe(
        mixStrawberriesAndSugar(strawberries, sugarPots),
        RTE.fromOption(() => Error("Empty jam pots"))
      )
    ),
    // Step 3 & 4: ONLY IF mixStrawberriesAndSugar returned a NEA, makeJam and notifyFriends
    RTE.chainFirstW(makeJamRTE),
    RTE.chainFirstW(_ => notifyFriendsRTE("I made jam!!!")),
    RTE.map(jamPots => ({ jamPotCount: jamPots.length })),
    // Otherwise, do nothing
    RTE.alt(() => RTE.of({ jamPotCount: 0 }))
  )

type Job<A> = {
  a: A
}
type Person = {
  name: string
  title: string
}

declare const getViableJobs: <A extends string>() => number

const getJobs1 =
  ({ name, title }: Person) =>
  async <A>(jobs: Job<A>[]): Promise<{ viableJobs: number }> => {
    // implementation
    return { viableJobs: getViableJobs() }
  }

const getJobs2: ({
  name,
  title,
}: Person) => <A>(jobs: Job<A>[]) => Promise<{ viableJobs: number }> =
  ({ name, title }) =>
  async jobs => {
    // implementation
    return { viableJobs: getViableJobs() }
  }

// const makeStrawberryJamImperative =
//   ({ kitchenConnection, smartphone }: MakeStrawberryJamRTEDeps) =>
//   async (sugarPots: SugarPot[]): Promise<{ jamPotCount: number }> => {
//     const strawberries = await kitchenConnection.fetchFromFridge<Strawberry>(
//       "small"
//     )

//     const strawberriesWithSugarPots = mixStrawberriesAndSugar(
//       strawberries,
//       sugarPots
//     )

//     if (O.isNone(strawberriesWithSugarPots)) {
//       return {
//         jamPotCount: 0,
//       }
//     }

//     await kitchenConnection.cookInPot(strawberriesWithSugarPots)
//     await smartphone.notifyFriends("I made jam!!!")

//     return {
//       jamPotCount: strawberriesWithSugarPots.value.length,
//     }
//   }
