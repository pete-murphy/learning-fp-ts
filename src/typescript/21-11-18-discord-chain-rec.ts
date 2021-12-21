import { Comonad1 } from "fp-ts/lib/Comonad"
import { flow, identity, pipe } from "fp-ts/lib/function"
import { Kind, URIS } from "fp-ts/lib/HKT"
import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Pred from "fp-ts/lib/Predicate"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Str from "fp-ts/lib/string"
import * as Struct from "fp-ts/lib/struct"
import * as Rd from "fp-ts/lib/Reader"
import * as TE from "fp-ts/lib/TaskEither"

// pipe(
//   TE.Do,
//   TE.bind("loadingResult", () => loader.load({ cursor, limit })),
//   TE.bind("entryList", ({ loadingResult }) =>
//       dataRepository.storeBulk({
//           info: info,
//           records: loadingResult.data as Record<string, unknown>[],
//       })
//   ),
//   TE.chainFirst(({ loadingResult }) => {
//       return schemaRepository.updateCursor(
//           info,
//           loadingResult.cursor
//       );
//   }),
//   TE.map(({ entryList }) => entryList)
// )
