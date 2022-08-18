// import "./ses-lockdown.js";
import 'ses';
import test from 'ava';
import { scaffold, readPowers } from './scaffold.js';
import { loadLocation } from '../src/import.js';
import { makeArchive } from '../src/archive.js';
import { parseArchive } from '../src/import-archive.js';

const { read } = readPowers;

const fixture = new URL(
  'fixtures-policy/node_modules/app/index.js',
  import.meta.url,
).toString();

const globals = {
  redPill: 42,
  bluePill: 2,
};
const policy = {
  resources: {
    app: {
      globals: {
        bluePill: true,
      },
      packages: {},
    },
    alice: {
      globals: {
        redPill: true,
      },
    },
  },
};

test('policy - globals access', async t => {
  t.plan(2);

  const application = await loadLocation(read, fixture);
  const {
    namespace: { alice, bob },
  } = await application.import({
    globals,
    // globalLexicals explicitly ignored.
    policy,
  });

  t.deepEqual(alice, { bluePill: 'undefined', redPill: 'number' });
  t.deepEqual(bob, { bluePill: 'number', redPill: 'undefined' });
});

test.only('policy - built into archive', async t => {
  t.plan(2);
  const archive = await makeArchive(readPowers, fixture, {
    policy,
    dev: true,
  });
  const application = await parseArchive(archive, '<unknown>');
  const {
    namespace: { alice, bob },
  } = await application.import({
    globals,
  });

  t.deepEqual(alice, { bluePill: 'undefined', redPill: 'number' });
  t.deepEqual(bob, { bluePill: 'number', redPill: 'undefined' });
});

const assertFixture = (t, { namespace }) => {
  const { alice, bob } = namespace;

  t.deepEqual(alice, { bluePill: 'undefined', redPill: 'number' });
  t.deepEqual(bob, { bluePill: 'number', redPill: 'undefined' });
};

const fixtureAssertionCount = 2;

scaffold(
  'fixture-policy',
  test,
  fixture,
  assertFixture,
  fixtureAssertionCount,
  {
    addGlobals: globals,
    policy,
  },
);
