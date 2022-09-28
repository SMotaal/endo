/* global globalThis */

import test from 'ava';
import { makeSafeEvaluator } from '../src/make-safe-evaluator.js';

test('scope behavior - lookup behavior', t => {
  t.plan(7);

  const globalObject = { globalProp: {} };
  const globalLexicals = { lexicalProp: {} };

  const { safeEvaluate: evaluate } = makeSafeEvaluator({
    globalObject,
    globalLexicals,
  });

  globalThis.realmGlobalProp = {};
  t.teardown(() => {
    delete globalThis.realmGlobalProp;
  });

  t.is(evaluate('globalThis'), undefined);
  t.is(evaluate('eval'), undefined);
  t.is(evaluate('realmGlobalProp'), undefined);
  t.throws(() => evaluate('missingProp'), { instanceOf: ReferenceError });

  t.is(evaluate('globalProp'), globalObject.globalProp);
  t.is(evaluate('lexicalProp'), globalLexicals.lexicalProp);

  // Known compromise in fidelity of the emulated script environment:
  t.deepEqual(evaluate('arguments'), ['arguments']);
});

test('scope behavior - lookup in sloppyGlobalsMode', t => {
  t.plan(5);

  const globalObject = {};
  const globalLexicals = {};
  const { safeEvaluate: evaluate } = makeSafeEvaluator({
    globalObject,
    globalLexicals,
    sloppyGlobalsMode: true,
  });

  globalThis.realmGlobalProp = {};
  t.teardown(() => {
    delete globalThis.realmGlobalProp;
  });

  t.is(evaluate('globalThis'), undefined);
  t.is(evaluate('eval'), undefined);
  t.is(evaluate('realmGlobalProp'), undefined);
  t.is(evaluate('missingProp'), undefined);

  // Known compromise in fidelity of the emulated script environment:
  t.deepEqual(evaluate('arguments'), ['arguments']);
});

test('scope behavior - this-value', t => {
  t.plan(16);

  let globalObjectProtoSetterValue;
  let globalObjectSetterValue;
  let globalLexicalsProtoSetterValue;
  let globalLexicalsSetterValue;

  const globalObjectProto = Object.create(null, {
    globalObjectProtoGetter: {
      get() {
        return this;
      },
    },
    globalObjectProtoSetter: {
      set(_value) {
        globalObjectProtoSetterValue = this;
      },
    },
    globalObjectProtoFn: {
      value() {
        return this;
      },
      configurable: true,
      writable: true,
    },
    globalObjectProtoFnImmutable: {
      value() {
        return this;
      },
      configurable: false,
      writable: false,
    },
  });
  const globalObject = Object.create(globalObjectProto, {
    globalObjectGetter: {
      get() {
        return this;
      },
    },
    globalObjectSetter: {
      set(_value) {
        globalObjectSetterValue = this;
      },
    },
    globalObjectFn: {
      value() {
        return this;
      },
      configurable: true,
      writable: true,
    },
    globalObjectFnImmutable: {
      value() {
        return this;
      },
      configurable: false,
      writable: false,
    },
  });
  const globalLexicalsProto = Object.create(null, {
    globalLexicalsProtoGetter: {
      get() {
        return this;
      },
    },
    globalLexicalsProtoSetter: {
      set(_value) {
        globalLexicalsProtoSetterValue = this;
      },
    },
    globalLexicalsProtoFn: {
      value() {
        return this;
      },
      configurable: true,
      writable: true,
    },
    globalLexicalsProtoFnImmutable: {
      value() {
        return this;
      },
      configurable: false,
      writable: false,
    },
  });
  const globalLexicals = Object.create(globalLexicalsProto, {
    globalLexicalsGetter: {
      get() {
        return this;
      },
    },
    globalLexicalsSetter: {
      set(_value) {
        globalLexicalsSetterValue = this;
      },
    },
    globalLexicalsFn: {
      value() {
        return this;
      },
      configurable: true,
      writable: true,
    },
    globalLexicalsFnImmutable: {
      value() {
        return this;
      },
      configurable: false,
      writable: false,
    },
  });

  const { safeEvaluate: evaluate } = makeSafeEvaluator({
    globalObject,
    globalLexicals,
  });

  // Known compromise in fidelity of the emulated script environment (all tests):

  t.is(evaluate('globalObjectProtoGetter'), globalObject);
  t.is(evaluate('globalObjectGetter'), globalObject);
  t.is(evaluate('globalLexicalsProtoGetter'), globalLexicals);
  t.is(evaluate('globalLexicalsGetter'), globalLexicals);

  evaluate('globalObjectProtoSetter = 123');
  t.is(globalObjectProtoSetterValue, globalObject);
  evaluate('globalObjectSetter = 123');
  t.is(globalObjectSetterValue, globalObject);
  evaluate('globalLexicalsProtoSetter = 123');
  t.is(globalLexicalsProtoSetterValue, globalLexicals);
  evaluate('globalLexicalsSetter = 123');
  t.is(globalLexicalsSetterValue, globalLexicals);

  t.is(evaluate('globalObjectProtoFn()'), globalObject);
  t.is(evaluate('globalObjectFn()'), globalObject);
  t.is(evaluate('globalObjectProtoFnImmutable()'), globalObject);
  t.is(evaluate('globalObjectFnImmutable()'), undefined);
  t.is(evaluate('globalLexicalsProtoFn()'), globalLexicals);
  t.is(evaluate('globalLexicalsFn()'), globalLexicals);
  t.is(evaluate('globalLexicalsProtoFnImmutable()'), globalLexicals);
  t.is(evaluate('globalLexicalsFnImmutable()'), undefined);
});

test('scope behavior - assignment', t => {
  t.plan(13);

  const globalObject = { foo: {} };
  const globalLexicals = { foobar: {} };
  const { safeEvaluate: evaluate } = makeSafeEvaluator({
    globalObject,
    globalLexicals,
  });
  const doAssignment = (leftHandRef, value) => {
    evaluate(`(value) => { ${leftHandRef} = value }`)(value);
  };

  globalThis.realmGlobalProp = {};
  t.teardown(() => {
    delete globalThis.realmGlobalProp;
  });

  const evil = {};
  // eslint-disable-next-line no-eval
  const originalEval = globalThis.eval;
  doAssignment('this.eval', evil);
  t.is(globalObject.eval, evil);
  // eslint-disable-next-line no-eval
  t.is(globalThis.eval, originalEval);

  const bar = {};
  const originalBar = globalThis.realmGlobalProp;
  doAssignment('this.realmGlobalProp', bar);
  t.is(globalObject.realmGlobalProp, bar);
  t.is(globalThis.realmGlobalProp, originalBar);

  const foo = {};
  const originalFoo = globalObject.foo;
  doAssignment('foo', foo);
  t.is(globalObject.foo, foo);
  t.not(globalObject.foo, originalFoo);
  t.is(globalThis.foo, undefined);

  const foobar = {};
  const originalFoobar = globalLexicals.foobar;
  doAssignment('foobar', foobar);
  t.is(globalLexicals.foobar, foobar);
  t.not(globalObject.foo, originalFoobar);
  t.is(globalObject.foobar, undefined);
  t.is(globalThis.foobar, undefined);

  t.is(Object.keys(globalObject).length, 3);
  t.is(Object.keys(globalLexicals).length, 1);
});

test('scope behavior - strict vs sloppy locally non-existing global set', t => {
  t.plan(4);

  const globalObject = {};
  const { safeEvaluate: evaluateStrict } = makeSafeEvaluator({
    globalObject,
    sloppyGlobalsMode: false,
  });
  const { safeEvaluate: evaluateSloppy } = makeSafeEvaluator({
    globalObject,
    sloppyGlobalsMode: true,
  });

  globalThis.realmGlobalProp = {};
  t.teardown(() => {
    delete globalThis.realmGlobalProp;
  });

  t.throws(() => evaluateStrict('realmGlobalProp = 123'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluateStrict('missingRealmGlobalProp = 123'), {
    instanceOf: ReferenceError,
  });
  t.notThrows(() => evaluateSloppy('realmGlobalProp = 456'));
  t.notThrows(() => evaluateSloppy('missingRealmGlobalProp = 456'));
});

test('scope behavior - realm globalThis property info leak', t => {
  t.plan(8);

  const globalObject = {};
  const { safeEvaluate: evaluate } = makeSafeEvaluator({
    globalObject,
  });

  t.is(evaluate('typeof missingRealmGlobalProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedRealmGlobalProp'), 'undefined');
  t.throws(() => evaluate('missingRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('eventuallyAssignedRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });

  globalThis.eventuallyAssignedRealmGlobalProp = {};
  t.teardown(() => {
    delete globalThis.eventuallyAssignedRealmGlobalProp;
  });

  t.is(evaluate('typeof missingRealmGlobalProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedRealmGlobalProp'), 'undefined');
  t.throws(() => evaluate('missingRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });
  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('eventuallyAssignedRealmGlobalProp'), undefined);
});

test('scope behavior - Symbol.unscopables fidelity test', t => {
  t.plan(33);

  const globalObject = {
    Symbol,
    [Symbol.unscopables]: {
      eventuallyAssignedRealmGlobalProp: true,
      localProp: true,
    },
    localProp: {},
  };
  const { safeEvaluate: evaluate } = makeSafeEvaluator({
    globalObject,
  });

  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('typeof localProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedLocalProp'), 'undefined');
  t.is(evaluate('typeof missingRealmGlobalProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedRealmGlobalProp'), 'undefined');

  // Known compromise in fidelity of the emulated script environment:
  t.throws(() => evaluate('localProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('eventuallyAssignedLocalProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('missingRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('eventuallyAssignedRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });

  globalThis.eventuallyAssignedRealmGlobalProp = {};
  t.teardown(() => {
    delete globalThis.eventuallyAssignedRealmGlobalProp;
  });

  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('typeof localProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedLocalProp'), 'undefined');
  t.is(evaluate('typeof missingRealmGlobalProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedRealmGlobalProp'), 'undefined');

  // Known compromise in fidelity of the emulated script environment:
  t.throws(() => evaluate('localProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('eventuallyAssignedLocalProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('missingRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });
  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('eventuallyAssignedRealmGlobalProp'), undefined);

  evaluate(
    'this[Symbol.unscopables] = { eventuallyAssignedRealmGlobalProp: true, localProp: true, eventuallyAssignedLocalProp: true }',
  );
  // after property is created on globalObject, assignment is evaluated to
  // test if it is affected by the Symbol.unscopables configuration
  globalObject.eventuallyAssignedLocalProp = null;
  // Known compromise in fidelity of the emulated script environment:
  t.throws(() => evaluate('eventuallyAssignedLocalProp = {}'), {
    instanceOf: ReferenceError,
  });

  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('typeof localProp'), 'undefined');
  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('typeof eventuallyAssignedLocalProp'), 'undefined');
  t.is(evaluate('typeof missingRealmGlobalProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedRealmGlobalProp'), 'undefined');

  // Known compromise in fidelity of the emulated script environment:
  t.throws(() => evaluate('localProp'), {
    instanceOf: ReferenceError,
  });
  // Known compromise in fidelity of the emulated script environment:
  t.throws(() => evaluate('eventuallyAssignedLocalProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('missingRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });
  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('eventuallyAssignedRealmGlobalProp'), undefined);

  // move "Symbol.unscopables" to prototype
  delete globalObject[Symbol.unscopables];
  const globalObjectProto = Reflect.getPrototypeOf(globalObject);
  globalObjectProto[Symbol.unscopables] = {
    eventuallyAssignedRealmGlobalProp: true,
    localProp: true,
    eventuallyAssignedLocalProp: true,
  };

  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('typeof localProp'), 'undefined');
  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('typeof eventuallyAssignedLocalProp'), 'undefined');
  t.is(evaluate('typeof missingRealmGlobalProp'), 'undefined');
  t.is(evaluate('typeof eventuallyAssignedRealmGlobalProp'), 'undefined');

  // Known compromise in fidelity of the emulated script environment:
  t.throws(() => evaluate('localProp'), {
    instanceOf: ReferenceError,
  });
  // Known compromise in fidelity of the emulated script environment:
  t.throws(() => evaluate('eventuallyAssignedLocalProp'), {
    instanceOf: ReferenceError,
  });
  t.throws(() => evaluate('missingRealmGlobalProp'), {
    instanceOf: ReferenceError,
  });
  // Known compromise in fidelity of the emulated script environment:
  t.is(evaluate('eventuallyAssignedRealmGlobalProp'), undefined);
});
