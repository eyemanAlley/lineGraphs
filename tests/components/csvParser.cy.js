import CSVParser from "src/app/components/csvParser";

// Here is an example of how we could test functions in our application instead of just components by using the CSVParser function as an example

describe("CSVParser", () => {
    it("Parses a CSV file and returns a JSON object", async () => {

        // Create a mock file to pass to the CSVParser
        const file = new File(['"a","b"\n1,2'], 'test.csv', { type: 'text/csv' })

        // Call the CSVParser function with the mock file
        await CSVParser(file).then((result) => {
            // Check that the result is as expected with the expect() function
            expect(result).to.deep.equal({ a: ["1"], b: ["2"] });
        });
    })
})
