const fs = require("fs");
const path = require("path");
const { readCustomersWithinRadius } = require("../src/customers");
const util = require("../src/util");

/**
 * The radius of the circle area surrounding the office to pick customers from (in metres).
 *
 * @type {Number}
 */
const DEFAULT_CUSTOMER_RADIUS = 100 * 1000;

if(require.main === module) {
    // Only execute program when run directly via node (i.e. not testing)
    main(process.argv.slice(2))
        .catch(util.fatal);
}

/**
 * find-customers <filepath> - Program entrypoint.
 *
 * @param  {Array<String>} argv Program arguments.
 * @return {Promise}            Resolves when complete.
 */
async function main(argv) {
    const [filepath] = argv;

    if(!filepath || argv.indexOf("--help") > -1) {
        return util.fatal(`Usage: find-customers <filepath>`);
    }

    // Input filepath is relative to the current working directory
    const absFilepath = path.resolve(process.cwd(), filepath);

    const customers = (await readCustomersWithinRadius(absFilepath, DEFAULT_CUSTOMER_RADIUS))
        .map(({ user_id, name }) => ({ user_id, name }))
        .sort((a, b) => a.user_id === b.user_id ? 0 : a.user_id > b.user_id ? 1 : -1);

    util.log(util.toCSV(customers));
}

module.exports = main;
