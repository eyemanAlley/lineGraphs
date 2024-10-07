import {getDocumentFieldsByDocumentName, getDocumentNamesByCollection, getAllDocumentNameAndDataByCollection} from "src/app/components/firebaseFetch.js";

describe("getDocumentFieldsByDocumentName1", () => {
    it("Retrieve all document fields by document and collection name - test to assure retrieved property is a string", async () => {

        await getDocumentFieldsByDocumentName("test-data","test-doc-1").then((result) => {
            // Check that the result is as expected with the expect() function
            expect(result).to.have.property("test-doc-1-string").that.is.a('string');
        });

    })
})

describe("getDocumentFieldsByDocumentName2", () => {
    it("Retrieve all document fields by document and collection name - test to assure retrieved object contains array", async () => {

        await getDocumentFieldsByDocumentName("test-data","test-doc-1").then((result) => {
            // Check that the result is as expected with the expect() function
            expect(result).to.deep.include({"test-doc-1-array":[ '1', '2', '3' ]})         
        });

    })
})

describe("getDocumentFieldsByDocumentName3", () => {
    it("Retrieve all document fields by document and collection name - test to assure retrieved object does not contains array", async () => {

        await getDocumentFieldsByDocumentName("test-data","test-doc-2").then((result) => {
            // Check that the result is as expected with the expect() function
            expect(result).to.not.equal({"test-doc-2-array": "['1','2','3']"})           
        });

    })
})

describe("getDocumentNamesByCollection1", () => {
    it("Retrieve all document names within a collection - test to check length of return object is 3", async () => {

        await getDocumentNamesByCollection("test-data").then((result) => {
            const realLength = Object.keys(result).length;
            expect(realLength).to.deep.equal(3);
        });
    })
})

describe("getDocumentNamesByCollection2", () => {
    it("Retrieve all document names within a collection - test to check retrieved object matches expected result", async () => {

        const testData = ["test-doc-1", "test-doc-2", "test-doc-3"]

        await getDocumentNamesByCollection("test-data").then((result) => {
            expect(result).to.deep.equal(testData);
        });
    })
})

describe("getDocumentNamesByCollection3", () => {
    it("Retrieve all document names within a collection - test to check retrieve 'heat-demand' is included in 'datasets' collection", async () => {

        await getDocumentNamesByCollection("datasets").then((result) => {
            expect(result).to.deep.include("heat-demand");
        });
    })
})

describe("getAllDocumentNameAndDataByCollection", () => {
    it("Retrieve all document fields by document and collection name - test to check if test-data collection data stored in firebase matches our expectation", async () => {

        const testData = {
            "test-doc-1": {
                "test-doc-1-array": ['1', '2', '3'],
                "test-doc-1-string": "this is a test string"
            },
            "test-doc-2": {
                "test-doc-2-array": ['3', '2', '1'],
            },
            "test-doc-3": {
            }
        }
        await getAllDocumentNameAndDataByCollection("test-data","test-doc-1").then((result) => {
            expect(result).to.deep.equal(testData);
        });
    })
})

