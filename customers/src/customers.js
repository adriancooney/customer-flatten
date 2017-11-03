const {
    readFile,
    getDistanceBetweenCoords
} = require("./util");

/**
 * The coordinates of the Intercom offices.
 *
 * @type {Object{ latitude<Number>, longitude<Number> }}
 */
const INTERCOM_OFFICE_LOCATION = { latitude: 53.339428, longitude: -6.257664 };

/**
 * Read customers from customer data file and pick only those from within
 * a specified radius from the Intercom office's location.
 *
 * @param  {String} filepath  The path to the customer data file.
 * @param  {Number} radius    The radius surrounding Intercom's office that a customer must lie (in metres).
 * @return {Array}        [description]
 */
async function readCustomersWithinRadius(filepath, radius) {
    try {
        const rawData = await readFile(filepath);
        const customers = parseCustomerData(rawData);

        return pickCustomersWithinRadius(customers, radius);
    } catch(err) {
        if(err.code === "ENOENT") {
            throw new Error(`Customer data file '${filepath}' does not exist.`);
        }

        throw err;
    }
}

/**
 * Pick customers from an array of customers witin a specified radius from the Intercom
 * office's locations.
 *
 * @param  {Array<Customer>} customers Array of customers (see `parseCustomerData`).
 * @param  {Number} radius             The radius surrounding Intercom's office that a customer must lie (in metres).
 * @return {Array<Customer>}           The customers within `radius`.
 */
function pickCustomersWithinRadius(customers, radius) {
    return customers.filter(customer => {
        const distance = getDistanceBetweenCoords(INTERCOM_OFFICE_LOCATION, {
            latitude: customer.latitude,
            longitude: customer.longitude
        });

        return distance < radius;
    });
}

/**
 * Parse a customer file (list of JSON objects).
 *
 * Customers are composed of the following properties:
 *
 *  type Customer = {
 *      user_id: Number,
 *      name: String,
 *      latitude: Number,
 *      longitude: Number
 *  }
 *
 * @param  {String} data      Contents of customer file.
 * @return {Array<Customer>}  Array of customers (see above for format).
 */
function parseCustomerData(data) {
    try {
        return data.split("\n")
            .map(line => JSON.parse(line))
            .map(datum => Object.assign(datum, {
                latitude: parseFloat(datum.latitude, 10),
                longitude: parseFloat(datum.longitude, 10),
            }));
    } catch(err) {
        if(err instanceof SyntaxError) {
            throw new Error("Unable to parse customer data, invalid input.");
        }

        throw err;
    }
}

module.exports = {
    readCustomersWithinRadius,
    pickCustomersWithinRadius,
    parseCustomerData
};
