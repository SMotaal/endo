// @ts-check

const { keys, create, entries } = Object;

const { has } = Reflect;

const copyGlobals = (globals, list) => {
  const g = create(null);
  if (list && list.length > 0) {
    for (let k = 0; k < list.length; k += 1) {
      const key = list[k];
      if (!has(globals, key)) {
        throw Error(
          `Policy specifies a global named ${key} but it has not been endowed to the application.`,
        );
      }
      g[key] = globals[key];
    }
  }
  return g;
};
const adaptId = id => {
  const chunks = id.replace(/\/$/, '').split('/node_modules/');
  if (chunks.length > 1) {
    chunks.shift();
  }
  return chunks.join('>');
};

/**
 * Returns the policy applicable to the id - either by taking from user
 * supplied policy or returning localPolicy if user didn't specify one at runtime.
 *
 * @param {string} id - a key in the policy resources spec
 * @param {Object|undefined} policy - user supplied policy
 * @returns {Object|undefined} policy fragment if policy was specified
 */
export const getPolicyFor = (id, policy) => {
  if (!policy) {
    return undefined;
  }
  if (policy.resources && policy.resources[adaptId(id)]) {
    return policy.resources[adaptId(id)];
  } else {
    return {};
  }
};
const getGlobalsList = myPolicy => {
  if (!myPolicy.globals) {
    return [];
  }
  // TODO: handle 'write' policy
  return entries(myPolicy.globals)
    .filter(([_k, v]) => v)
    .map(([k, _v]) => k);
};

export const getAllowedGlobals = (globals, localPolicy) => {
  if (!localPolicy) {
    return globals;
  }
  const list = getGlobalsList(localPolicy);
  return copyGlobals(globals, list);
};
