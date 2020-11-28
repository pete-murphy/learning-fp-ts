import { array } from "fp-ts/lib/Array"
import { monoidSum } from "fp-ts/lib/Monoid"
import { pipe } from "fp-ts/lib/pipeable"
import * as L from "monocle-ts/lib/Lens"
import * as O from "monocle-ts/lib/Optional"
import * as T from "monocle-ts/lib/Traversal"

export type StripeErrorCode =
  | "authentication_required"
  | "insufficient_funds"
  | "highest_risk_level"
  | "expired_card"
  | "card_declined"
  | "generic_decline"

export type StripeCharge = {
  amount: number
  failure_code?: StripeErrorCode
  failure_message?: string
}

export type StripePaymentIntent = {
  amount: number
  charges?: Array<StripeCharge>
}

const traversalStripePaymentIntentCharges: T.Traversal<
  StripePaymentIntent,
  StripeCharge
> = pipe(
  L.id<StripePaymentIntent>(),
  L.prop("charges"), // Lens     <StripePaymentIntent, Array<StripeCharge> | undefined>
  L.fromNullable,    // Optional <StripePaymentIntent, Array<StripeCharge>
  O.traverse(array)  // Traversal<StripePaymentIntent, StripeCharge>
)

const example1: StripePaymentIntent = {
  amount: 999,
}
const example2: StripePaymentIntent = {
  amount: 999,
  charges: [],
}
const example3: StripePaymentIntent = {
  amount: 999,
  charges: [
    {
      amount: 2000,
    },
    { amount: 9090 },
  ],
}

const sumChargeAmounts = pipe(
  traversalStripePaymentIntentCharges,
  T.prop("amount"),
  T.fold(monoidSum)
)

sumChargeAmounts(example1) //-> 0
sumChargeAmounts(example2) //-> 0
sumChargeAmounts(example3) //-> 11090
