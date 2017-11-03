const path = require("path");
const {
    pickCustomersWithinRadius,
    readCustomersWithinRadius,
    parseCustomerData
} = require("../src/customers");

const CUSTOMER_DATA = `\
{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}
{"latitude": "51.92893", "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}
{"latitude": "51.8856167", "user_id": 2, "name": "Ian McArdle", "longitude": "-10.4240951"}`;

describe("customers", () => {
    describe("parseCustomerData", () => {
        it("should correctly parse valid customer data", () => {
            const customers = parseCustomerData(CUSTOMER_DATA);

            expect(customers.length).toEqual(3);
            expect(customers[0].name).toEqual("Christina McArdle");
            expect(customers[0].user_id).toEqual(12);
            expect(customers[0].latitude).toEqual(52.986375);
            expect(customers[0].longitude).toEqual(-6.043701);
        });

        it("should throw an error when invalid data is passed", () => {
            try {
                parseCustomerData("{{a");
            } catch(err) {
                expect(err.message).toMatch(/unable to parse customer data/i);
            }
        });
    });

    describe("pickCustomersWithinRadius", () => {
        it("should return customers within specified radius", () => {
            const customers = [
                {"latitude": 52.986375, "user_id": 12, "name": "Christina McArdle", "longitude": -6.043701},
                {"latitude": 51.92893, "user_id": 1, "name": "Alice Cahill", "longitude": -10.27699},
                {"latitude": 51.8856167, "user_id": 2, "name": "Ian McArdle", "longitude": -10.4240951}
            ];

            const picked = pickCustomersWithinRadius(customers, 100 * 1000);

            expect(picked.length).toEqual(1);
            expect(picked[0]).toEqual(customers[0]);
        });
    });

    describe("readCustomersWithinRadius", () => {
        it("should read customers from customer log file and return customers within radius", async () => {
            const customers = await readCustomersWithinRadius(path.resolve(__dirname, "../data/customers.log"), 20 * 1000);

            // Example of snapshot testing.
            expect(customers).toMatchSnapshot();
        });

        it("should throw a nice error if customer data does not exist", async () => {
            try {
                await readCustomersWithinRadius("foobar");
            } catch(err) {
                expect(err.message).toMatch(/customer data file 'foobar' does not exist/i);
            }
        });
    });
});
