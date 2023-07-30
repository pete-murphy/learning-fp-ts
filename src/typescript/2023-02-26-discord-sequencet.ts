import { Ap, pipe, TE } from "./lib/fp-ts-imports";

type Failure = "FAILURE";
type ProgramDetails = "ProgramDetails";
type ResourceSummary = "ResourceSummary";
declare const programService: {
  getById: (resourceId: string) => TE.TaskEither<Failure, ProgramDetails>;
  getResourceSummary: (_: {
    resourceId: string;
    resourceType: "schemas";
  }) => TE.TaskEither<Failure, ResourceSummary>;
};

declare const resourceId: string;

const responseTE = Ap.sequenceT(TE.ApplyPar)(
  programService.getById(resourceId),
  programService.getResourceSummary({
    resourceId,
    resourceType: "schemas",
  }),
);
const responseTE_ = pipe(
  TE.Do,
  TE.apS("programDetails", programService.getById(resourceId)),
  TE.apSW(
    "resourceSummary",
    programService.getResourceSummary({
      resourceId,
      resourceType: "schemas",
    }),
  ),
  TE.map(({ programDetails, resourceSummary }) => [
    programDetails,
    resourceSummary,
  ]),
);
