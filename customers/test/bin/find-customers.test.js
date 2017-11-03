const util = require("../../src/util");
const findCustomers = require("../../bin/find-customers");

describe("find-customers", () => {
    let logMock, fatalMock;

    beforeAll(() => {
        logMock = jest.spyOn(util, "log");
        fatalMock = jest.spyOn(util, "fatal");
    });

    beforeEach(() => {
        logMock.mockReset();
        fatalMock.mockReset();
    });

    afterAll(() => {
        logMock.mockRestore();
        fatalMock.mockRestore();
    });

    it("should output help if `--help` is passed", async () => {
        await findCustomers(["--help"]);

        expect(fatalMock).toHaveBeenCalled();
    });

    it("should output help if no arguments passed", async () => {
        await findCustomers([]);

        expect(fatalMock).toHaveBeenCalled();
    });

    it("should correctly read in customer data and output customers", async () => {
        const processMock = jest.spyOn(process, "cwd").mockImplementation(() => __dirname);

        await findCustomers(["../../data/customers.log"]);

        processMock.mockRestore();

        expect(logMock).toHaveBeenCalled();
        expect(logMock.mock.calls[0][0]).toMatchSnapshot();
    });
});
