const fs = require("fs");

/**
 * The radius of the earth (in metres).
 *
 * @type {Number}
 */
const EARTH_CIRCUMFERENCE = 40075 * 1000;

/**
 * Convert an input array of objects to CSV.
 *
 * @param  {Array<Object>} data An array of objects to convert to CSV.
 * @return {String}             CSV string (or empty string if no data provided)
 */
function toCSV(data) {
    if(!data.length) {
        return "";
    }

    const headers = Object.keys(data[0]).sort();

    const rows = data.map(datum => {
        return headers.map(header => {
            const value = datum[header];

            // Wrap strings in quotes and escape nested quotes
            return typeof value === "string" ? `"${value.replace(/"/g, "\\\"")}"` : value;
        });
    });

    return [headers].concat(rows).map(row => row.join(",")).join("\n");
}

/**
 * Read a file into a buffer (promisified fs).
 *
 * @param  {String} filepath  The absolute path to the file.
 * @return {Promise<Buffer>}  Resolves with the Buffer contents of the file.
 */
async function readFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if(err) {
                return reject(err);
            }

            resolve(data.toString());
        });
    });
}

/**
 * Get the distance between two coordinates, described as a latitude and longitude, on
 * a sphere. Note: latitude and longitude must be in degrees (not radians).
 *
 * Formula to calculate distance between two points p and q on a sphere [1]:
 *
 *    d = arccos(sin(p_lat) * sin(q_lat) + cos(p_lat) * cos(q_lat) * cos(|p_long - q_long|))
 *
 * [1]: https://en.wikipedia.org/wiki/Great-circle_distance
 *
 * @param  {Object{ latitude<Number>, longitude<Number> }} p
 * @param  {Object{ latitude<Number>, longitude<Number> }} q
 * @return {Number} The distance in meters between the two points `p` and `q`.
 */
function getDistanceBetweenCoords(p, q) {
    const pLat = toRadian(p.latitude);
    const pLong = toRadian(p.longitude);
    const qLat = toRadian(q.latitude);
    const qLong = toRadian(q.longitude);

    const arc = Math.acos(
        Math.sin(pLat) * Math.sin(qLat) +
        Math.cos(pLat) * Math.cos(qLat) * Math.cos(Math.abs(pLong - qLong))
    );

    return (EARTH_CIRCUMFERENCE / (2 * Math.PI)) * arc;
}

/**
 * Convert a degree to radian.
 *
 * @param  {Number} degree The input degree number.
 * @return {Number}        Degree converted to radiun.
 */
function toRadian(degree) {
    return (Math.PI / 180) * degree;
}

/**
 * Log a message to stderr and exit the program with code 1.
 *
 * @param  {String} message Error message to print to stderr before exiting.
 */
function fatal(message) {
    if(message instanceof Error) {
        message = `Error: ${message.message}`;
    }

    // eslint-disable-next-line no-console
    console.error(message);
    process.exit(1);
}

/**
 * Log a message to stdout.
 *
 * @param  {String} message Message to log.
 */
function log(message) {
    // eslint-disable-next-line no-console
    console.log(message);
}

module.exports = {
    toCSV, readFile, getDistanceBetweenCoords, toRadian, fatal, log
};
