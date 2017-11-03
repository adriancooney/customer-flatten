const fs = require("fs");
const {
    fatal,
    toCSV,
    toRadian,
    readFile,
    getDistanceBetweenCoords
} = require("../src/util");

describe("util", () => {
    describe("getDistanceBetweenCoords", () => {
        it("should correctly calculate the distance between two coordinates", () => {
            // Reference: https://www.movable-type.co.uk/scripts/latlong.html
            const locationA = { latitude: 53.967848, longitude: -6.879825 };
            const locationB = { latitude: 53.339428, longitude: -6.257664 };
            const expectedDistanceAB = 81.02 * 1000;
            const actualDistanceAB = getDistanceBetweenCoords(locationA, locationB);
            const error = Math.abs(expectedDistanceAB - actualDistanceAB);

            // Expect precision to be within one kilometre
            expect(error).toBeLessThan(1000);
        });
    });

    describe("toRadian", () => {
        it("should correctly convert degrees to radians", () => {
            expect(toRadian(0)).toEqual(0);
            expect(toRadian(180)).toEqual(Math.PI);
            expect(toRadian(90)).toBeCloseTo(1.5708, 3);
        });
    });

    describe("toCSV", () => {
        it("should convert rows to csv output", () => {
            expect(toCSV([
                { a: 1, b: 2 },
                { a: 2, b: "3" }
            ])).toEqual("a,b\n1,2\n2,\"3\"");
        });

        it("should escape strings with quotes", () => {
            expect(toCSV([
                { a: "double \" quotes" },
            ])).toEqual("a\n\"double \\\" quotes\"");
        });

        it("should return empty string for empty data rows", () => {
            expect(toCSV([])).toEqual("");
        });
    });

    describe("readFile", () => {
        it("should correctly read the contents of a file", async () => {
            const contents = "foobar";
            const fsMock = jest.spyOn(fs, "readFile").mockImplementation((f, cb) => cb(null, contents));

            await expect(readFile("foobar.txt")).resolves.toEqual("foobar");

            fsMock.mockRestore();
        });

        it("should fail when file does not exist", async () => {
            const error = new Error();
            const fsMock = jest.spyOn(fs, "readFile").mockImplementation((f, cb) => cb(error));

            await expect(readFile("__NOT_EXIST__")).rejects.toBe(error);

            fsMock.mockRestore();
        });
    });

    describe("fatal", () => {
        it("should log to stderr and exit", async () => {
            const consoleMock = jest.spyOn(console, "error").mockImplementation(() => {});
            const processMock = jest.spyOn(process, "exit").mockImplementation(() => {});

            fatal("no!");

            expect(consoleMock).toHaveBeenCalledWith("no!");
            expect(processMock).toHaveBeenCalledWith(1);

            consoleMock.mockRestore();
            processMock.mockRestore();
        });
    });
});
