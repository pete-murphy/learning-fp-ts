// import { vms } from "./search/vm.examples.ignore";
import _ from "lodash";
import { group } from "fp-ts/lib/NonEmptyArray";
import { contramap, eqString } from "fp-ts/lib/Eq";
import { VM } from "./search/vm.types.ignore";
import { vmToNameLens } from "./search/search";
import * as M from "fp-ts/lib/Map";
import { array, snoc, getMonoid } from "fp-ts/lib/Array";
import { fromFoldable } from "fp-ts/lib/Record";

// _.groupBy(vms, "group.name"); //?

const eqVm = contramap(vmToNameLens.get)(eqString);
// group(eqVm)(vms); //?

// fromFoldable(array)(vms.map(vm => [vmToNameLens.get(vm), [vm]]), concat); //?

type X = {
  name: string;
  id: number;
};

const xs = [
  { name: "foo", id: 1 },
  { name: "bar", id: 2 },
  { name: "foo", id: 3 }
];
fromFoldable(getMonoid<X>(), array)(xs.map(x => [x.name, [x]])); //?
