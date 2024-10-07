'use client';
import React, { useEffect, useState } from "react";
import CSVParser from "src/app/components/csvParser.js";
import { getAllDocumentNameAndDataByCollection } from "src/app/components/firebaseFetch.js";
import { firebasePush } from "src/app/components/firebaseUpdate.js";
import Lottie from "lottie-react";
import loadingAnimation from "public/lottie/uk-loading.json";

const UpdateVisualisation = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [csvData, setCSVData] = useState(null);
  const [datasetInformation, setDatasetInformation] = useState({});
  const [dataProcessing, setDataProcessing] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [dataLastUpdated, setDataLastUpdated] = useState("");

  useEffect(() => {
    document.title = 'CIREGS - Admin / Update Visualisation';
    pullDatasetFields();
    const user = JSON.parse(localStorage.getItem("user"));
  },[]);

  useEffect(() => {
    console.log('dataProcessing in useEffect:', dataProcessing);
  }, [dataProcessing]);


const pullDatasetFields = async () => {
  try {
    // Check if data is already cached
    const datasetDataCache = localStorage.getItem('datasetData');
    if (datasetDataCache) {
      const {data: fetchedData, expiryTime, lastUpdate} = JSON.parse(datasetDataCache);

      // Check if data is expired
      if(Date.now() < expiryTime){
        setDataLastUpdated(Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(lastUpdate));
        setDatasetInformation(fetchedData);

      }else{
        const fetchedData = await getAllDocumentNameAndDataByCollection("datasets");
        const expiryTime = Date.now() + 60 * 60 * 24 * 1000 * 7;
        const lastUpdate = Date.now();

        // Cache the data
        localStorage.setItem('datasetData', JSON.stringify({data: fetchedData, expiryTime, lastUpdate}));

        setDatasetInformation(fetchedData);
        setDataLastUpdated(Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(lastUpdate));
      }
    } else {
      // Fetch data from Firebase
      const fetchedData = await getAllDocumentNameAndDataByCollection("datasets");
      const expiryTime = Date.now() + 60 * 60 * 24 * 1000 * 7;
      const lastUpdate = Date.now();

      // Cache the data
      localStorage.setItem('datasetData', JSON.stringify({data: fetchedData, expiryTime, lastUpdate}));

      setDatasetInformation(fetchedData);

      setDataLastUpdated(Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(lastUpdate));
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

}

  const handleFileUpload = async (file) => {
    console.log("File uploaded");
    let csvParserRtn = await CSVParser(file);
    setCSVData(csvParserRtn);
    console.log("CSV data set");
  };

  const handleDatasetUpdate = async (e) => {
    try{
      await firebasePush(csvData, selectedOption)

      setDataProcessing((prevState) => {
        console.log('Previous dataProcessing state:', prevState);
        return true;
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      setDataProcessing(false);
      setProcessingComplete(true);

      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.reload();

    }catch(error){
      console.log(error);
      setDataProcessing(false);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  const handleUpdateSubmit = (e) => {
    console.log("Update submitted")
    setDataProcessing(true);
    handleDatasetUpdate();
  }

  const handleForceRefresh = () => {
    console.log('Force refresh')
    if (localStorage.getItem('datasetData')){
      console.log('datasetData cache exists');
      localStorage.removeItem('datasetData');
      setDatasetInformation({});
    }
    pullDatasetFields();
  };


  return (
    <div className=" pt-6 grid grid-cols-2 h-full">
        <div className="w-full pl-10">
            <h1 className="text-4xl font-bold py-3">Update Dataset</h1>
            <div className="py-3">
                <div className="flex justify-between py-3">
                  <div className="justify-center items-center">
                    <p className="text-lg">Select Dataset</p>
                    <p className="text-xs">Last updated: {dataLastUpdated} - This is only here to avoid firebase limit, cache expires in 7 days</p>
                  </div>
                  <div className="flex justify-center items-center">
                    <button className="cursor-pointer" onClick={handleForceRefresh}>
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-5 h-5 mx-2">
                        <path d="M3.254,6.572c0.008,0.072,0.048,0.123,0.082,0.187c0.036,0.07,0.06,0.137,0.12,0.187C3.47,6.957,3.47,6.978,3.484,6.988c0.048,0.034,0.108,0.018,0.162,0.035c0.057,0.019,0.1,0.066,0.164,0.066c0.004,0,0.01,0,0.015,0l2.934-0.074c0.317-0.007,0.568-0.271,0.56-0.589C7.311,6.113,7.055,5.865,6.744,5.865c-0.005,0-0.01,0-0.015,0L5.074,5.907c2.146-2.118,5.604-2.634,7.971-1.007c2.775,1.912,3.48,5.726,1.57,8.501c-1.912,2.781-5.729,3.486-8.507,1.572c-0.259-0.18-0.618-0.119-0.799,0.146c-0.18,0.262-0.114,0.621,0.148,0.801c1.254,0.863,2.687,1.279,4.106,1.279c2.313,0,4.591-1.1,6.001-3.146c2.268-3.297,1.432-7.829-1.867-10.101c-2.781-1.913-6.816-1.36-9.351,1.058L4.309,3.567C4.303,3.252,4.036,3.069,3.72,3.007C3.402,3.015,3.151,3.279,3.16,3.597l0.075,2.932C3.234,6.547,3.251,6.556,3.254,6.572z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {Object.keys(datasetInformation).length > 0 ? (
                <select disabled={dataProcessing} className="cursor-pointer w-full text-black bg-gray-100 hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none" onChange={handleOptionChange}>
                    <option selected="true" disabled="true" >Select visualisation</option>
                    {Object.keys(datasetInformation).map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                    ))}
                </select>
                ) : (
                    <p>Loading data...</p>
                )}
                {selectedOption && (
                    <div>
                        {datasetInformation[selectedOption]?.dependants && (
                        <div>
                            <p className="font-bold pt-3">The following visualisations will be affected:</p>
                            <p className="pb-3">{datasetInformation[selectedOption].dependants.join(', ')}</p>
                        </div>
                        )}
                    </div>
                )}
                <p className="text-lg pt-3">Upload Dataset</p>
                <p className="pb-3 text-sm">Dataset must include headers and be a csv file. For best results, ensure that your csv matches previous uploads.</p>
                <input className='cursor-pointer w-full text-black bg-gray-100 hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none file:mr-4 file:rounded-lg file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' type="file" accept=".csv" disabled={dataProcessing} onChange={handleFileChange} />
                <p className="text-lg py-3">Update Description</p>
                <div className="pb-3">
                    <textarea disabled rows="4" className="w-full h-full bg-gray-100 rounded-lg">This should probably not be here! we need two options: Update Dataset and Update Visualisation. This should be present for update visualisation</textarea>
                </div>
                <button className="py-3 text-white dark:text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none w-full " disabled={dataProcessing} onClick={handleUpdateSubmit}>Update Dataset</button>
            </div>

        </div>
        <div className="w-full pl-10">
            <h2 className="text-4xl font-bold py-3">Current Visualisation</h2>
            <div className="w-full h-full">
            {dataProcessing && 
            <div>
              <p className="font-bold text-3xl text-red-500">Data is being processed. DO NOT LEAVE THIS PAGE</p>
              <p>This could take a few minutes.</p>
              <div className="w-full h-full flex justify-center items-center pt-10 pb-10">
                <div className="h-[30]">
                  <Lottie animationData={loadingAnimation} height={20} width={20} loop={true}/>
                </div>
              </div>


            </div>
            }
            {processingComplete &&
            <div>
              <p className="font-bold text-3xl text-green-500">Data processing complete</p>
            </div>
            }
            </div>
        </div>

    </div>

  );
};

export default UpdateVisualisation;
