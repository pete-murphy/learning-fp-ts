// import { TE } from "./lib/fp-ts-imports";
import { taskEither as TE, taskOption as TO, array as A } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import R from "ramda";

// declare const getCampaignConsumeList: () => Promise<
//   { campaignId: number; consume: number }[]
// >;
// declare const getCampaignPaidMap: (
//   campaignIds: number[],
// ) => Promise<Map<number, number>>;
// declare const getHighCostCampaigns: (
//   consumeList: { campaignId: number; consume: number }[],
//   paidMap: Map<number, number>,
// ) => Promise<{ id: number; consume: number }[]>;
// declare const getLatestAlarmHistory: (campaign: {
//   id: number;
//   consume: number;
// }) => Promise<{ campaignId: number }[]>;
// declare const alarm: (campaigns: { id: number; consume: number }[]) => void;
// declare const recordAlarmHistory: (
//   campaigns: {
//     id: number;
//     consume: number;
//   }[],
// ) => void;

// async function main() {
//   // First I need to get campaigns' consumes from db
//   const consumeList = await getCampaignConsumeList();
//   // Pick their ids
//   const campaignIds = R.pluck("campaignId", consumeList);
//   // I need to retrieve how many orders they have, in order to calculate cost later
//   const paidMap = await getCampaignPaidMap(campaignIds);
//   // I can calculate cost with consume and paid, so I can get those high cost campaigns
//   const highCostCampaigns = await getHighCostCampaigns(consumeList, paidMap);
//   // I need to check if the campaign has already alarmed
//   const alreadyAlarmed = await Promise.all(
//     highCostCampaigns.map(getLatestAlarmHistory),
//   );
//   // These need to alarm
//   const shouldAlarmList = highCostCampaigns.filter(
//     campaign =>
//       !R.pluck("campaignId", alreadyAlarmed.flat()).includes(campaign.id),
//   );
//   // Alarm, like send email
//   await alarm(shouldAlarmList);
//   // Write alarm history
//   await recordAlarmHistory(shouldAlarmList);
// }

declare const getCampaignConsumeList: () => TO.TaskOption<
  { campaignId: number; consume: number }[]
>;
declare const getCampaignPaidMap: (
  campaignIds: number[],
) => TO.TaskOption<Map<number, number>>;
declare const getHighCostCampaigns: (
  consumeList: { campaignId: number; consume: number }[],
  paidMap: Map<number, number>,
) => TO.TaskOption<{ id: number; consume: number }[]>;
declare const getLatestAlarmHistory: (campaign: {
  id: number;
  consume: number;
}) => TO.TaskOption<{ campaignId: number }[]>;
declare const alarm: (
  campaigns: { id: number; consume: number }[],
) => TO.TaskOption<void>;
declare const recordAlarmHistory: (
  campaigns: {
    id: number;
    consume: number;
  }[],
) => TO.TaskOption<void>;

const main = () =>
  pipe(
    TO.Do,
    // First I need to get campaigns' consumes from db
    TO.apS("consumeList", getCampaignConsumeList()),
    // Pick their ids
    TO.let("campaignIds", ({ consumeList }) =>
      R.pluck("campaignId", consumeList),
    ),
    // I need to retrieve how many orders they have, in order to calculate cost later
    TO.bind("paidMap", ({ campaignIds }) => getCampaignPaidMap(campaignIds)),
    // I can calculate cost with consume and paid, so I can get those high cost campaigns
    TO.bind("highCostCampaigns", ({ consumeList, paidMap }) =>
      getHighCostCampaigns(consumeList, paidMap),
    ),
    // I need to check if the campaign has already alarmed
    TO.bind("alreadyAlarmed", ({ highCostCampaigns }) =>
      TO.traverseArray(getLatestAlarmHistory)(highCostCampaigns),
    ),
    // These need to alarm
    TO.let("shouldAlarmList", ({ highCostCampaigns, alreadyAlarmed }) =>
      highCostCampaigns.filter(
        campaign =>
          !R.pluck("campaignId", alreadyAlarmed.flat()).includes(campaign.id),
      ),
    ),
    TO.chain(({ shouldAlarmList }) =>
      pipe(
        // Alarm, like send email
        alarm(shouldAlarmList),
        // Write alarm history
        TO.apSecond(recordAlarmHistory(shouldAlarmList)),
      ),
    ),
  );

//
//   const paidMap = await getCampaignPaidMap(campaignIds);
//   // I can calculate cost with consume and paid, so I can get those high cost campaigns
//   const highCostCampaigns = await getHighCostCampaigns(consumeList, paidMap);
//   // I need to check if the campaign has already alarmed
//   const alreadyAlarmed = await Promise.all(
//     highCostCampaigns.map(getLatestAlarmHistory),
//   );
//   // These need to alarm
//   const shouldAlarmList = highCostCampaigns.filter(
//     campaign =>
//       !R.pluck("campaignId", alreadyAlarmed.flat()).includes(campaign.id),
//   );
//   // Alarm, like send email
//   await alarm(shouldAlarmList);
//   // Write alarm history
//   await recordAlarmHistory(shouldAlarmList);

/*

```diff
- declare const getCampaignConsumeList: () => Promise<
+ declare const getCampaignConsumeList: () => TO.TaskOption<
    { campaignId: number; consume: number }[]
  >;

  declare const getCampaignPaidMap: (
    campaignIds: number[],
- ) => Promise<Map<number, number>>;
+ ) => TO.TaskOption<Map<number, number>>;

  declare const getHighCostCampaigns: (
    consumeList: { campaignId: number; consume: number }[],
    paidMap: Map<number, number>,
- ) => Promise<{ id: number; consume: number }[]>;
+ ) => TO.TaskOption<{ id: number; consume: number }[]>;

  declare const getLatestAlarmHistory: (campaign: {
    id: number;
    consume: number;
- }) => Promise<{ campaignId: number }[]>;
+ }) => TO.TaskOption<{ campaignId: number }[]>;

- declare const alarm: (campaigns: { id: number; consume: number }[]) => void;
+ declare const alarm: (campaigns: { id: number; consume: number }[]) => TO.TaskOption<void>;

  declare const recordAlarmHistory: (
    campaigns: {
      id: number;
      consume: number;
    }[];
- ) => void;
+ ) => TO.TaskOption<void>;
```
*/

// declare const getCampaignConsumeList: () => TO.TaskOption<
//   { campaignId: number; consume: number }[]
// >;
// declare const getCampaignPaidMap: (
//   campaignIds: number[],
// ) => TO.TaskOption<Map<number, number>>;

// declare const getLatestAlarmHistory: (campaign: {
//   id: number;
//   consume: number;
// }) => TO.TaskOption<{ campaignId: number }[]>;
// declare const alarm: (campaigns: { id: number; consume: number }[]) => void;
// declare const recordAlarmHistory: (
//   campaigns: {
//     id: number;
//     consume: number;
//   }[],
// ) => void;
// declare const getHighCostCampaigns: (
//   campaignList: { campaignId: number; consume: number }[],
// ) => (paidMap: Map<number, number>) => { id: number; consume: number }[];
// declare const getAlarmHistory: (campaign: {
//   id: number;
//   consume: number;
// }) => TO.TaskOption<{ campaignId: number }[]>;
// declare const filterShouldAlarm: ()

// const main = pipe(
//   getCampaignConsumeList(),
//   TO.chain(campaignList => {
//     return pipe(
//       R.pluck("campaignId", campaignList),
//       getCampaignPaidMap,
//       TO.map(getHighCostCampaigns(campaignList)),
//       TO.chain(highCostCampaigns =>
//         pipe(
//           highCostCampaigns,
//           R.map(getAlarmHistory),
//           A.sequence(TO.ApplicativeSeq), // :thinking: Am I using it right?
//           TO.map(R.flatten),
//           TO.map(filterShouldAlarm(highCostCampaigns)),
//           TO.chain(recordAlarmHistory),
//           TO.map(alarm),
//         ),
//       ),
//     );
//   }),
//   TO.match(
//     e => {
//       // this.logger.error(e);
//       return e;
//     },
//     () => "ok",
//   ),
// );
