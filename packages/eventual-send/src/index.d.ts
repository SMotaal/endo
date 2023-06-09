import type { HandledPromiseConstructor, EProxy } from './types.d';

// Exposing types directly per the jsdoc annotations and comments.
//
//   See: https://grep.app/search?q=%5E%20%2A%28export%20%2B%29import%20%2A%5Cw%2B%20%2A%3D&regexp=true&filter[repo][0]=microsoft/TypeScript&filter[path][0]=tests/
//
//   Note: Some types will not include the jsdoc docs, but
//         those still propagate for the source entities of
//         the respective annotations. Types exported below
//         are intended for type-checking against decoupled
//         references between packages.

export type {
  RemotableBrand,
  DataOnly,
  FarRef,
  ERef,
  EProxy,
  EOnly,
  RemoteFunctions,
  LocalRecord,
  FilteredKeys,
  PickCallable,
  EPromiseKit as RemoteKit,
  ResolveWithPresenceOptionsBag,
  HandledExecutor,
  Settler,
  HandledPromiseStaticMethods,
  HandledPromiseConstructor,
  Handler as EHandler,
} from './types.d';

declare namespace global {
  // eslint-disable-next-line vars-on-top,no-var
  var HandledPromise: HandledPromiseConstructor;
}

export declare const HandledPromise: HandledPromiseConstructor;

export const E: EProxy;
