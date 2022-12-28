// @ts-check

import { makeDetailsToken, isDetailsToken, DetailsToken } from "./details.js";

/** @typedef { DetailsToken | { toString(): string } | string } Details */

/**
 * Creates an error instance.
 * 
 * @param {Details} [details] The details of the error
 * @param {ErrorConstructor} [constructor] The error constructor to use
 * @param {{ errorName?: string }} [options] Options
 */
const makeError = (
    details = makeDetailsToken(`Assertion failed`),
    constructor = globalThis.Error,
    // @ts-ignore
    { errorName = undefined } = {},
) => {
    return new constructor(`${isDetailsToken(details) ? details : makeDetailsToken(details)}`);
};
Object.freeze(makeError);

export { makeError };