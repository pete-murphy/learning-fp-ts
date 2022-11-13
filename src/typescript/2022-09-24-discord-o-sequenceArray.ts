import { pipe, tupled } from "fp-ts/lib/function";
import { O, RR } from "./lib/fp-ts-imports";

declare const getPrimitiveFieldValue: (
  x: string,
  r: Record<string, any>
) => O.Option<any>;

// How would I fix this error?
// function getAssetFieldValue(fieldValue: Record<string, any>): O.Option<any> {
//   const x = O.sequenceArray([
//     getPrimitiveFieldValue('assetGuid', fieldValue),
//     getPrimitiveFieldValue('assetType', fieldValue),
//   ]);
//   return pipe(
//     x,
//     O.map(tupled((assetGuid: any, assetType: any) => {
//       return { assetGuid, assetType };
//     }))
//   );
// }

function getAssetFieldValue_<A>(fieldValue: Record<string, A>) {
  return pipe(
    O.Do,
    O.apS("assetGuid", RR.lookup("assetGuid")(fieldValue)),
    O.apS("assetType", RR.lookup("assetType")(fieldValue))
  );
}

function getAssetFieldValue<A>(fieldValue: Record<string, A>) {
  return pipe(
    O.Do,
    O.apS("assetGuid", O.fromNullable(fieldValue["assetGuid"])),
    O.apS("assetType", O.fromNullable(fieldValue["assetType"]))
  );
}
