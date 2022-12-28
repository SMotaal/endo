// @ts-check
// /// <reference types="@endo/retyped-ses" />
import '@endo/retyped-ses';

assert(false);
assert.details``;
assert.details(Object());

globalThis.assert(false);
globalThis.assert.details``;
globalThis.assert.details(Object());

notAssert?.();
notAssert?.details;

globalThis.notAssert?.();
globalThis.notAssert?.details;
