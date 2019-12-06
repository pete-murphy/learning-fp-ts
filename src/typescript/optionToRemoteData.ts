import rd from "../json/rd.json"
// import { fromOption } from "fp-ts/lib/Either"
import { fromOption } from "@devexperts/remote-data-ts"

Object.keys(rd) //?

rd.visibleDeploymentsRemoteData //?

// from(() => "foo")(rd.selectedDeploymentKeyOpt) //?
fromOption
