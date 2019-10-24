import _ from "lodash";
import lunr from "lunr";

import { vms } from "./vm.examples";

/**
 * Searches and array of virtual machines for all items that have a string match
 * on one of the specified searchable data fields.
 */
export const searchVirtualMachines = (virtualMachines, searchFilter) => {
  const index = new lunr.Index();
  let searchResults = [];

  index.pipeline.add(lunr.trimmer);

  // define all of the virtual machines fields that should be searched
  index.ref("_id");
  index.field("name");
  index.field("description");
  index.field("hostname");
  index.field("os");
  index.field("groupName");
  index.field("ipAddresses");
  index.field("state");

  // compute the group name and flatten all network connection IP addresses for searching
  virtualMachines.forEach(virtualMachine => {
    const searchableVirtualMachines = {
      ...virtualMachine,
      groupName: _.get(virtualMachine, "group.name"),
      ipAddresses: _.flatten(_.map(virtualMachine.networks, "ip")).join(" ")
    };

    index.add(searchableVirtualMachines);
  });

  // split the search filter on the OR character and perform search for each substring
  _.split(searchFilter, "|").forEach(substring => {
    searchResults = _.union(searchResults, index.search(substring));
  });

  // filter the virtual machine array for all matched results
  const matchedVirtualMachines = _.filter(virtualMachines, virtualMachine =>
    _.some(searchResults, ["ref", virtualMachine._id])
  );

  return matchedVirtualMachines;
};

searchVirtualMachines(vms, "hhel"); //?
