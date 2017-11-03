const flatten = require("../src/flatten");

describe("flatten", () => {
    it("should always return an array regardless of input", () => {
        expect(flatten([])).toEqual([]);
        expect(flatten(1)).toEqual([]);
        expect(flatten(true)).toEqual([]);
        expect(flatten({})).toEqual([]);
        expect(flatten(() => {})).toEqual([]);
        expect(flatten(undefined)).toEqual([]);
        expect(flatten()).toEqual([]);
    });

    it("should not mutate the original array", () => {
        const input = [1, [2], 3];
        const output = flatten(input);

        expect(input).not.toBe(output);
        expect(Array.isArray(input[1])).toBe(true);
    });

    it("should flatten an array of non-array values correctly", () => {
        expect(flatten([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("should flatten an array of arrays and values", () => {
        expect(flatten([[1, 2], 3, [4, [5, 6]]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should flatten empty arrays", () => {
        expect(flatten([[[], []], []])).toEqual([]);
        expect(flatten([1, [], 2])).toEqual([1, 2]);
    });
});
