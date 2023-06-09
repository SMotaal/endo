/* eslint-disable import/export */

// Module Types //////////////////////////////////////////////////////

// @ts-ignore TS1383: Only named exports may use 'export type'.
export type * from './E.js';
// @ts-ignore TS1383: Only named exports may use 'export type'.
export type * from './handled-promise.js';
// @ts-ignore TS1383: Only named exports may use 'export type'.
export type * from './track-turns.js';

// Utility Types /////////////////////////////////////////////////////

export type Callable = (...args: unknown[]) => any;
