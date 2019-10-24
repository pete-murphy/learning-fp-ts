import { VM, Group, Network } from "./vm.types.ignore";
import { fromArray, some } from "fp-ts/lib/Set";
import { Lens } from "monocle-ts";
import { map } from "fp-ts/lib/Array";
import { eqString } from "fp-ts/lib/Eq";
import { escapeRegExp } from "lodash";

import { vms } from "./vm.examples.ignore";

export const vmToGroupLens = Lens.fromNullableProp<VM>()("group", {
  name: "UNCATEGORIZED"
} as Group);
export const groupToNameLens = Lens.fromProp<Group>()("name");
export const vmToNameLens = vmToGroupLens.compose(groupToNameLens);

const normalize = (str: string) => str.trim().toLocaleLowerCase();

const vmToStringSet = (vm: VM): Set<string> => {
  const { name, description, hostname, os, state } = vm;
  const groupName = vmToNameLens.get(vm);
  const ipAddresses = map<Network, string>(network => network.ip)(
    vm.networks
  ).join(" ");

  return fromArray(eqString)(
    map(normalize)([
      name,
      description,
      hostname,
      os,
      state,
      groupName,
      ipAddresses
    ])
  );
};

const WILDCARD = "*";

const toRegExp = (s: string): RegExp =>
  new RegExp(
    s
      .split(WILDCARD)
      .map(escapeRegExp)
      .join(".")
  );

const matchesSubstringOf = (searchFilter: string) => {
  const searchFilterSubstrings = searchFilter.split("|").map(normalize);
  return (s: string): boolean =>
    searchFilterSubstrings.some(substring => {
      if (substring.length > s.length) {
        return false;
      } else if (substring.includes(WILDCARD)) {
        return toRegExp(substring).test(s);
      } else {
        return s.includes(substring);
      }
    });
};

// Currying so that the partially applied `searchVirtualMachines(vms)` can be memoized
export const searchVirtualMachines = (virtualMachines: Array<VM>) => {
  const virtualMachinesById = virtualMachines.reduce(
    (acc: { [id: string]: VM }, vm) => {
      acc[vm._id] = vm;
      return acc;
    },
    {}
  );

  const virtualMachineSearchIndex = virtualMachines.reduce(
    (acc: { [id: string]: Set<string> }, vm) => {
      acc[vm._id] = vmToStringSet(vm);
      return acc;
    },
    {}
  );

  return (searchFilter: string) => {
    let idSet = new Set<string>([]);
    for (const k in virtualMachineSearchIndex) {
      if (
        some(matchesSubstringOf(searchFilter))(virtualMachineSearchIndex[k])
      ) {
        idSet.add(k);
      }
    }
    return Array.from(idSet).map(id => virtualMachinesById[id]);
  };
};

searchVirtualMachines(vms)("fo|fu"); //?
