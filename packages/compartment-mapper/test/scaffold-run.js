import 'ses';
import fs from 'fs';
import crypto from 'crypto';
import url from 'url';
import { loadLocation } from '../index.js';
import { makeReadPowers } from '../src/node-powers.js';

export const readPowers = makeReadPowers({ fs, crypto, url });

const globals = {
  globalProperty: 42,
  globalLexical: 'global', // should be overshadowed
};

const globalLexicals = {
  globalLexical: 'globalLexical',
};

let modules;

const builtinLocation = new URL(
  'fixtures-0/node_modules/builtin/builtin.js',
  import.meta.url,
).toString();

// The setup prepares a builtin module namespace object that gets threaded into
// all subsequent tests to satisfy the "builtin" module dependency of the
// application package.

export async function setup() {
  if (modules === undefined) {
    const utility = await loadLocation(readPowers, builtinLocation);
    const { namespace } = await utility.import({ globals });
    // We pass the builtin module into the module map.
    modules = {
      builtin: namespace,
    };
  }
  return { modules, globals, globalLexicals };
}

async function run(fixture) {
  await setup();

  const application = await loadLocation(readPowers, fixture, {
    dev: true,
  });
  const { namespace } = await application.import({
    globals,
    globalLexicals,
    modules,
    Compartment,
  });

  console.log(namespace);
}

// eslint-disable-next-line no-undef
const fixture = new URL(`../${process.argv[2]}`, import.meta.url).toString();
run(fixture);
