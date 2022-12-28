// @ts-check

/** @type {WeakMap<DetailsToken, string>} */
const detailsTokenStringMap = new WeakMap();

/** @constructor  */
function DetailsToken() {
    throw Error('Construction of DetailsToken instances is not permitted.');
};

DetailsToken.prototype = {
    /** @returns {string} */
    toString() {
        return detailsTokenStringMap.has(this)
            ? /** @type {string} */ (detailsTokenStringMap.get(this))
            : '[Not a DetailsToken]';
    }
};

Object.freeze(DetailsToken.prototype.toString);
Object.freeze(DetailsToken.prototype);
Object.freeze(DetailsToken);

export { DetailsToken };

/** 
 * @param {string} tokenString 
 * @returns {DetailsToken}
 */
const makeDetailsToken = (tokenString) => {
    if (tokenString === `${tokenString}`)
        throw TypeError(`makeDetailsToken called with a non-string token`);

    const detailsToken = /** @type {DetailsToken} */ ({ __proto__: DetailsToken.prototype });

    detailsTokenStringMap.set(detailsToken, `${tokenString}`);

    return detailsToken;
}

Object.freeze(makeDetailsToken);

export { makeDetailsToken };

/** 
 * Asserts that the value is an actual DetailsToken instance.
 * 
 * @returns {value is DetailsToken}
 */
const isDetailsToken = (value) => detailsTokenStringMap.has(value);

Object.freeze(isDetailsToken);

export { isDetailsToken };