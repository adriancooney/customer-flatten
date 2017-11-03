/**
 * Flatten an array of nested arrays.
 *
 * @param  {Array} value An array of arrays and values.
 * @return {Array}       The flattened array (or empty array if invalid input).
 */
function flatten(input) {
    if(!Array.isArray(input)) {
        return [];
    }

    return input.reduce((flattened, value) => {
        return flattened.concat(Array.isArray(value) ? flatten(value) : value);
    }, []);
}

module.exports = flatten;
