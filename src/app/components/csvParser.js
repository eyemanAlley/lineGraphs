import Papa from 'papaparse';

// function takes parsed csv and returns JSON object with headers as keys and values as arrays
function ExtractValuesWithHeaders(result){
    console.log("Extracting values with headers");
    // init array for headers with all values from data
    let headerRows = [];
    // get column names (headers) from parsed csv
    let headers = result.meta.fields;
    // loop through headers
    for(let i = 0; i<headers.length; i++){
        // create temp row
        let row = [];
        console.log('header: ', headers[i]);
        // loop through data and push values where header matches
        for(let y=0; y<result.data.length; y++){
            let current = result.data[y];
            row.push(current[headers[i]]);
        }
        // push row to headerRows     
        headerRows.push(row); 
        console.log("Header complete")

    }
    var resultObject = {};
    // loop through headers and add headerRows values to JSON object
    headers.forEach(function (key, index) {
        resultObject[key] = headerRows[index];
    });
    console.log(resultObject);
    return resultObject;
}

export default async function CSVParser(file){
    return new Promise((resolve, reject) =>{
        // carry out papaparse on csv, sends result to ExtractValuesWithHeaders function
        Papa.parse(file, {
        complete: (result) => {
            console.log('Parsed CSV result:', result);
            resolve(ExtractValuesWithHeaders(result));

        },
        header: true,
        error: (error) => {
            console.log('Error parsing CSV file:', error);
            reject(error);
        }
    });

});
}
