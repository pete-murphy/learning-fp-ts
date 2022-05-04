import { O, pipe, TE } from "./lib/fp-ts-imports";

type OrgData = {
stripeCustomerId: string,
subscription: {
  blastPriceId: string
}
}
declare const orgDataOpt: O.Option<OrgData>

declare const getBlastSubscriptionItemTE = (_:{

// stripeCustomerId: string,
//   blastPriceId: string
// }) => TE.TaskEither<{}, >

pipe(
  TE.Do,
  TE.bind('org', () =>
    pipe(
      orgDataOpt,
      TE.fromOption(() => console.warn('error')),
    ),
  ),
  TE.bind('blastSubscriptionItem', ({ org }) =>
    getBlastSubscriptionItemTE({
      stripeCustomerId: org.stripeCustomerId,
      blastPriceId: org.subscription.blastPriceId,
    }),
  ),
  TE.bind('currentBlastUsage', ({ blastSubscriptionItem, org }) =>
    getCurrentUsageTE({
      subscriptionItemId: blastSubscriptionItem,
      stripeCustomerId: org.stripeCustomerId,
    }),
  ),
)