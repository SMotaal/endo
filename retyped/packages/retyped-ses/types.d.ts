declare module "src/error/internal/details" {
    /** @constructor  */
    export function DetailsToken(): void;
    export class DetailsToken {
        /** @returns {string} */
        toString(): string;
    }
    /**
     * @param {string} tokenString
     * @returns {DetailsToken}
     */
    export function makeDetailsToken(tokenString: string): DetailsToken;
    /**
     * Asserts that the value is an actual DetailsToken instance.
     *
     * @returns {value is DetailsToken}
     */
    export function isDetailsToken(value: any): value is DetailsToken;
}
declare module "src/error/internal/errors" {
    export type Details = DetailsToken | {
        toString(): string;
    } | string;
    /** @typedef { DetailsToken | { toString(): string } | string } Details */
    /**
     * Creates an error instance.
     *
     * @param {Details} [details] The details of the error
     * @param {ErrorConstructor} [constructor] The error constructor to use
     * @param {{ errorName?: string }} [options] Options
     */
    export function makeError(details?: Details | undefined, constructor?: ErrorConstructor | undefined, { errorName }?: {
        errorName?: string | undefined;
    } | undefined): Error;
    import { DetailsToken } from "src/error/internal/details";
}
declare module "src/error/internal/assert" {
    /**
     * Creates a DetailsToken instance.
     *
     * @param {TemplateStringsArray} template
     * @param  {...*} args
     * @returns {DetailsToken}
     */
    export function details(template: TemplateStringsArray, ...args: any[]): DetailsToken;
    /**
     * Throws an error.
     *
     * @param {Details} failedDetails The details to throw
     * @param {ErrorConstructor} errorConstructor The error type to be thrown
     * @returns {InstanceType<ErrorConstructor>}
     */
    export function fail(failedDetails?: Details, errorConstructor?: ErrorConstructor): InstanceType<ErrorConstructor>;
    export const error: (details?: import("src/error/internal/errors").Details | undefined, constructor?: ErrorConstructor | undefined, { errorName }?: {
        errorName?: string | undefined;
    } | undefined) => Error;
    /**
     * Creates an `assert` function that throws an error if the flag is falsy.
     *
     * @param {Function} [raise]
     * @returns {typeof assert}
     */
    export function makeAssert(raise?: Function | undefined): typeof assert;
    export type Details = DetailsToken | {
        toString(): string;
    } | string;
    import { DetailsToken } from "src/error/internal/details";
    /** @typedef { DetailsToken | { toString(): string } | string } Details */
    /**
     * Asserts that the flag is truthy or throws an error if it is falsy.
     *
     * @param {*} flag Truthy/falsy value
     * @param {Details} failedDetails The details to throw if flag is falsy
     * @param {ErrorConstructor} [errorConstructor] The error type to be thrown if flag is falsy
     */
    export function assert(flag: any, failedDetails?: Details, errorConstructor?: ErrorConstructor | undefined): void;
    export namespace assert {
        /**
         * Creates a DetailsToken instance.
         *
         * @param {TemplateStringsArray} template
         * @param  {...*} args
         * @returns {DetailsToken}
         */
        export function details(template: TemplateStringsArray, ...args: any[]): DetailsToken;
        /**
         * Throws an error.
         *
         * @param {Details} failedDetails The details to throw
         * @param {ErrorConstructor} errorConstructor The error type to be thrown
         * @returns {InstanceType<ErrorConstructor>}
         */
        export function fail(failedDetails?: Details, errorConstructor?: ErrorConstructor): Error;
        export { makeError as error };
        /**
         * Creates an `assert` function that throws an error if the flag is falsy.
         *
         * @param {Function} [raise]
         * @returns {typeof assert}
         */
        export function makeAssert(raise?: Function | undefined): typeof assert;
    }
    import { makeError } from "src/error/internal/errors";
}
declare module "src/error/assert" {
    export { assert, makeAssert, fail, error, details } from "./internal/assert.js";
}
declare module "index" {
    export {};
}
declare module "src/error/internal/assert.1" {
    export type Details = DetailsToken | {
        toString(): string;
    } | string;
    /**
     * Creates a DetailsToken instance.
     *
     * @param {TemplateStringsArray} template
     * @param  {...*} args
     * @returns {DetailsToken}
     */
    export function details(template: TemplateStringsArray, ...args: any[]): DetailsToken;
    /**
     * Throws an error.
     *
     * @param {Details} failedDetails The details to throw
     * @param {ErrorConstructor} errorConstructor The error type to be thrown
     * @returns {InstanceType<ErrorConstructor>}
     */
    export function fail(failedDetails?: Details, errorConstructor?: ErrorConstructor): InstanceType<ErrorConstructor>;
    /**
     * Creates an error instance.
     *
     * @param {Details} [details] The details of the error
     * @param {ErrorConstructor} [constructor] The error constructor to use
     */
    export const error: (details?: import("src/error/internal/errors").Details | undefined, constructor?: ErrorConstructor | undefined, { errorName }?: {
        errorName?: string | undefined;
    } | undefined) => Error;
    /**
     * Creates an `assert` function that throws an error if the flag is falsy.
     *
     * @param {Function} [raise]
     * @returns {typeof assert}
     */
    export function makeAssert(raise?: Function | undefined): typeof assert;
    /** @typedef { DetailsToken | { toString(): string } | string } Details */
    /**
     * Asserts that the flag is truthy or throws an error if it is falsy.
     *
     * @param {*} flag Truthy/falsy value
     * @param {Details} failedDetails The details to throw if flag is falsy
     * @param {ErrorConstructor} [errorConstructor] The error type to be thrown if flag is falsy
     */
    export function assert(flag: any, failedDetails?: Details, errorConstructor?: ErrorConstructor | undefined): void;
    export namespace assert {
        export { details };
        export { fail };
        export { error };
        export { makeAssert };
    }
    import { DetailsToken } from "src/error/internal/details";
}
