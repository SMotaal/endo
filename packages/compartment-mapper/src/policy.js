// @ts-check

const { keys, create, entries } = Object;

const copyGlobals = (globals, list) => {
  const g = create(null);
  if (list && list.length > 0) {
    for (let k in list) {
      g[list[k]] = globals[list[k]];
    }
  }
  process._rawDebug(g);

  return g;
};
const adaptId = id => {
  // if we switch to id by location, this will need to parse location
  return id;
};
const getPolicyFor = (id, policy, localPolicy) => {
  if (policy && policy.resources) {
    return policy.resources[adaptId(id)];
  } else {
    return localPolicy || {};
  }
};
const getGlobalsList = myPolicy => {
  if (!myPolicy.globals) {
    return [];
  }
  return entries(myPolicy.globals)
    .filter(([k, v]) => v)
    .map(([k, v]) => k);
};


export function policyEnforcer(policy) {
  return {
    getGlobalsFor(id, globals, localPolicy) {
      const list = getGlobalsList(getPolicyFor(id, policy, localPolicy));
      process._rawDebug('>>>',id, keys(globals), list, localPolicy);
      return copyGlobals(globals, list);
    },
    getPolicyFor: id => getPolicyFor(adaptId(id), policy),
  };
}
