// @ts-check

import { makeDetailsToken, DetailsToken } from "./details.js";
import { makeError } from "./errors.js";

/** @typedef { DetailsToken | { toString(): string } | string } Details */

/**
 * Asserts that the flag is truthy or throws an error if it is falsy.
 * 
 * @param {*} flag Truthy/falsy value
 * @param {Details} failedDetails The details to throw if flag is falsy
 * @param {ErrorConstructor} [errorConstructor] The error type to be thrown if flag is falsy
 */
function assert(
    flag,
    failedDetails = assert.details`Check failed`,
    errorConstructor = globalThis.Error,
) {
    if (!flag) assert.fail(failedDetails, errorConstructor);
};

/**
 * Creates a DetailsToken instance.
 * 
 * @param {TemplateStringsArray} template 
 * @param  {...*} args 
 * @returns {DetailsToken}
 */
const details = (template, ...args) => makeDetailsToken(String.raw(template, ...args));

Object.freeze(details);
assert.details = details;
export { details };

/** 
 * Throws an error.
 * 
 * @param {Details} failedDetails The details to throw 
 * @param {ErrorConstructor} errorConstructor The error type to be thrown
 * @returns {InstanceType<ErrorConstructor>}
 */
const fail = (
    failedDetails = makeDetailsToken(`Check failed`),
    errorConstructor = globalThis.Error
) => {
    throw assert.error(failedDetails, errorConstructor);
};

Object.freeze(fail);
assert.fail = fail;
export { fail };

/**
 * Creates an error instance.
 * 
 * @param {Details} [details] The details of the error
 * @param {ErrorConstructor} [constructor] The error constructor to use
 */
const error = makeError;
assert.error = error;
export { error };

/**
 * Creates an `assert` function that throws an error if the flag is falsy.
 * 
 * @param {Function} [raise] 
 * @returns {typeof assert}
 */
const makeAssert = (raise) => Object.freeze(
    Object.assign(
        /** @type {typeof assert} */((flag, failedDetails, errorConstructor) => {
            if (flag) return;
            const error = assert.error(failedDetails, errorConstructor);
            if (typeof raise === 'function') raise(error);
            throw error;
        }),
        assert
    )
);

Object.freeze(makeAssert);
assert.makeAssert = makeAssert;
export { makeAssert };

Object.freeze(assert);
export { assert };