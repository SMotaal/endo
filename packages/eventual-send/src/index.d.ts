import * as _E from './E.js';
import * as _HandledPromise from './handled-promise.js';
import * as _Postponed from './postponed.js';

// Exposing types directly per the jsdoc annotations and comments.
//
//   See: https://grep.app/search?q=%5E%20%2A%28export%20%2B%29import%20%2A%5Cw%2B%20%2A%3D&regexp=true&filter[repo][0]=microsoft/TypeScript&filter[path][0]=tests/
//
//   Note: Some types will not include the jsdoc docs, but
//         those still propagate for the source entities of
//         the respective annotations. Types exported below
//         are intended for type-checking against decoupled
//         references between packages.

export import RemotableBrand = _E.RemotableBrand;
export import DataOnly = _E.DataOnly;
export import FarRef = _E.FarRef;
export import ERef = _E.ERef;
export import EProxy = _E.EProxy;
export import EOnly = _E.EOnly;
export import RemoteFunctions = _E.RemoteFunctions;
export import LocalRecord = _E.LocalRecord;
export import FilteredKeys = _E.FilteredKeys;
export import PickCallable = _E.PickCallable;
export import RemoteKit = _E.EPromiseKit;

export import ResolveWithPresenceOptionsBag = _HandledPromise.ResolveWithPresenceOptionsBag;
export import HandledExecutor = _HandledPromise.HandledExecutor;
export import Settler = _HandledPromise.Settler;
export import HandledPromiseStaticMethods = _HandledPromise.HandledPromiseStaticMethods;
export import HandledPromiseConstructor = _HandledPromise.HandledPromiseConstructor;

export import EHandler = _HandledPromise.Handler;

// Type definitions for eventual-send

/**
 * @file Type definitions for @agoric/eventual-send
 *
 * Some useful background knowledge:
 *
 * `Omit<T, U>` means to return a record type `T2` which has none of the properties whose keys are part of `U`.
 * `Omit<{a: 1, b: 2, c: 3}, 'b'>` is the type `{a: 1, c: 3}`.
 *
 * `Pick<T, U>` means to return a record type `T2` which has only the properties whose keys are part of `U`.
 * `Pick<{a: 1, b: 2, c: 3}, 'b'>` is the type `{b: 2}`.
 *
 * `PromiseLike<T>` is a thenable which resolves to `T`.
 *
 * `Promise<PromiseLike<T>>` doesn't handle recursion and is distinct from `T`.
 *
 * `Unpromise<PromiseLike<T>>` strips off just one layer and is just `T`.  `Unpromise<PromiseLike<PromiseLIke<T>>` is `PromiseLike<T>`.
 *
 * `Awaited<PromiseLike<T>>` recurses, and is just `T`.
 * `Awaited<PromiseLike<PromiseLike<T>>>` is just `T` as well.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/generics.html#handbook-content}
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html}
 */

declare namespace global {
  // eslint-disable-next-line vars-on-top,no-var
  var HandledPromise: HandledPromiseConstructor;
}

export declare const HandledPromise: HandledPromiseConstructor;

export const E: EProxy;
