'use client';
import React, { useEffect, useState } from "react";
import {firebaseAddDocumentToCollection, firebasePush} from 'src/app/components/firebaseUpdate';
import CSVParser from "src/app/components/csvParser.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from "lottie-react";
import loadingAnimation from "public/lottie/loading-dark.json";
// Visualisations
import LineGraph from "src/app/components/lineGraphVisualisation";
import DonutBarChart from "src/app/components/donutBarVisualisations";
import MapVisualisationDeckGL from 'src/app/components/mapVisualisationDeckGL';


const CreateVisualisation = () => {
  useEffect(() => {
    document.title = 'CIREGS - Admin / Create Visualisation';
    const user = JSON.parse(localStorage.getItem("user"));
  },[]);

  // All useStates for the form
  const [csvData, setCSVData] = useState(null);
  const [visualisationDocumentName, setVisualisationDocumentName] = useState("");
  const [visualisationName, setVisualisationName] = useState("");
  const [visualisationDescription, setVisualisationDescription] = useState("");
  const [visualisationType, setVisualisationType] = useState("");
  // Donut specific useStates
  const [donutLabels, setDonutLabels] = useState("");
  const [donutCollectionNums, setDonutCollectionNums] = useState('');
  const [donutCalcFunc, setDonutCalcFunc] = useState("");
  // Heatmap specific useStates
  const [heatmapCollection, setHeatmapCollection] = useState("");
  const [heatmapField, setHeatmapField] = useState("");

  // Preview useStates
  const [previewActive, setPreviewActive] = useState(false);
  const [previewDocument, setPreviewDocument] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


  // ============= Async funcs for the form =============
  const onNameChange = (e) => {
    setVisualisationName(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onDescriptionChange = (e) => {
    setVisualisationDescription(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onTypeChange = (e) => {
    setVisualisationType(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onHeatmapFieldChange = (e) => {
    setHeatmapField(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onHeatmapCollectionChange = (e) => {
    setHeatmapCollection(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onDonutLabelsChange = (e) => {
    setDonutLabels(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onDonutCollectionNumsChange = (e) => {
    setDonutCollectionNums(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onFunctionChange = (e) => {
    setDonutCalcFunc(e.target.value);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    setVisualisationDocumentName(file.name.replace(/\.[^/.]+$/, "")); // Gets rid of the file extension
    const processedData = await CSVParser(file);
    setCSVData(processedData);
    setPreviewActive(false);
    setPreviewDocument('');
  };

  // ============= Validation =============
  const validateForm = () => {
    let valid = true;
    if (!visualisationName.trim()) {
      toast.error('Name cannot be empty.');
      valid = false;
    }
    if (visualisationDocumentName === "") {
      toast.error('Please upload a csv file.');
      valid = false;
    }
    if (visualisationType === "") {
      toast.error('Please select a visualisation type.');
      valid = false;
    }
    if (visualisationDescription === "") {
      toast.error('Please enter a description.');
      valid = false;
    }
    if (visualisationType === "DonutBarChart" && donutLabels === "") {
      toast.error('Please enter labels for the donut chart.');
      valid = false;
    }
    if (visualisationType === "DonutBarChart" && donutCalcFunc === "") {
      toast.error('Please select a function for the donut chart.');
      valid = false;
    }
    return valid;
  };

  // ============= Async funcs for the preview =============
  const onPreview = () => {
    const collectionName = Date.now() + "-" + visualisationDocumentName + "-csv";
    if (validateForm() === false) {
      return;
    }
    try{
      firebasePush(csvData, visualisationDocumentName);
      toast.success('Successfully uploaded csv file.');
      setPreviewDocument(collectionName);
      if(visualisationType === "UkMapGL") {
        setPreviewLoading(true);
        sleep(4000).then(() => { // Unlike the other visualisations, the map needs to ensure it has uploaded the data before it can be previewed
          setPreviewActive(true);
          setPreviewLoading(false);
        });
      } else {
        setPreviewActive(true);
      }
    } catch(error){
      toast.error('Error while uploading csv file.');
      console.log(error);
      return;
    }
  };

    // ============= test donut data for the preview =============
    const testDonutData = {
      document : csvData,
      labels : donutLabels.split(","),
      collectionNums : () => {
        if (donutCollectionNums === "") {
          return null;
        }
        return donutCollectionNums.split(",").map(Number)
      },
      calcFunc : donutCalcFunc,
      name : visualisationName
    };

  // ============= Async funcs for the visualisation upload =============
  const onVisualisationCreate = () => {
    let collectionName = Date.now() + "-" + visualisationDocumentName + "-csv";
    if (validateForm() === false) {
      return;
    }

    try{
      if (previewDocument === "") { // If the user has not previewed the visualisation then upload the csv
        firebasePush(csvData, visualisationDocumentName);
        toast.success('Successfully uploaded csv file.');
      } else { // Otherwise use the previewed csv document name
        collectionName = previewDocument;
      }

      if (visualisationType === "DonutBarChart") {
        firebaseAddDocumentToCollection("visualisations", {
          data : {
            name: visualisationName,
            description: visualisationDescription,
            type: visualisationType,
            document: collectionName,
            Labels: donutLabels.split(","),
            collectionNums: donutCollectionNums.split(",").map(Number),
            function: donutCalcFunc
          }   
        }, visualisationName);
      toast.success('Successfully created visualisation.');
      } else if(visualisationType === "UkMapGL") {
        firebaseAddDocumentToCollection("visualisations", {
          data : {
            name: visualisationName,
            description: visualisationDescription,
            type: visualisationType,
            document: collectionName,
            collection: heatmapCollection,
            field: heatmapField
          }
        }, visualisationName);
      } else {
        firebaseAddDocumentToCollection("visualisations", {
          data : {
            name: visualisationName,
            description: visualisationDescription,
            type: visualisationType,
            document: collectionName,
          }   
        }, visualisationName);
    }
    firebaseAddDocumentToCollection("datasets", {
      dependants: [visualisationName]
    }, visualisationDocumentName);
    toast.success('Successfully created visualisation.');
    window.location.reload(); // Refresh the page to clear the form
    } catch(error){
      toast.error('Error while creating visualisation. Please check your inputs and try again.');
      console.log(error);
    }
  };

  return (
    <div className=" pt-6 grid grid-cols-2">
        <div className="w-full pl-10">
            <h1 className="text-4xl text-black font-bold py-3">Create Visualisation</h1>
            <div className="py-3">
                <p className="text-lg text-black py-3">Visualisation Name</p>
                <div className="pb-3">
                    <textarea className="w-full h-full bg-gray-100 rounded-lg text-black" onChange={onNameChange}></textarea>
                </div>
                <p className="text-lg py-3 text-black">Select Visualisation Type</p>
                <select className="w-full text-black bg-gray-100 hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none" onChange={onTypeChange}>
                    <option value="">Select visualisation</option>
                    <option value="DonutBarChart">Donut Chart</option>
                    <option value="UkMapGL">Heat Map</option>
                    <option value="LineGraph">Line Graph</option>
                </select>
                <p className="text-lg pt-3 text-black">Upload Dataset</p>
                <p className="pb-3 text-sm">Dataset must include headers and be a csv file. For best results, ensure that your csv matches previous uploads.</p>
                <input className='w-full text-black bg-gray-100 hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none file:mr-4 file:rounded-lg file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' type="file" accept=".csv" onChange={onFileChange} />
                <p className="text-lg py-3 text-black">Add Description</p>
                <div className="pb-3">
                    <textarea className="w-full h-full bg-gray-100 rounded-lg text-black" onChange={onDescriptionChange}></textarea>
                </div>
                {visualisationType === "UkMapGL" && (
                  <div>
                    <p className="text-lg py-3 text-black">Add the field name of the document to use</p>
                    <div className="pb-3">
                      <textarea className="w-full h-full bg-gray-100 rounded-lg text-black" onChange={onHeatmapFieldChange}></textarea>
                    </div>
                    <p className="text-lg py-3 text-black">Add the collection name to use</p>
                    <div className="pb-3">
                      <textarea className="w-full h-full bg-gray-100 rounded-lg text-black" onChange={onHeatmapCollectionChange}></textarea>
                    </div>
                  </div>
                )}
                {visualisationType === "DonutBarChart" && (
                <div>
                  <p className="text-lg pt-3 text-black">Add the labels on the donut chart</p>
                  <p className="pb-3 text-sm text-black">Seperate with commas e.g. Urban, Villages, etc</p>
                  <div className="pb-3">
                      <textarea className="w-full h-full bg-gray-100 rounded-lg text-black" onChange={onDonutLabelsChange}></textarea>
                  </div>
                  <p className="text-lg pt-3 text-black">Add the columns of where the data is stored.</p>
                  <p className="pb-3 text-sm text-black">Seperate with commas. This assumes each columns are a summed to a total, if the data is all in one single column then leave blank.</p>
                  <div className="pb-3">
                      <textarea className="w-full h-full bg-gray-100 rounded-lg text-black" onChange={onDonutCollectionNumsChange}></textarea>
                  </div>
                  <p className="text-lg py-3 text-black">Select the type of data this chart uses</p>
                  <select className="w-full text-black bg-gray-100 hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none" onChange={onFunctionChange}>
                      <option value="default">Select function</option>
                      <option value="calculateTechnology">Technology</option>
                      <option value="calculateDwellingType">Dwellings</option>
                      <option value="calculateRurality">Rurality</option>
                      <option value="none">Other</option>
                  </select>
                </div>
                )} 
                <div className="w-full flex">
                  <button className="py-3 text-white dark:text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none w-1/2" onClick={onPreview}>Preview</button>
                  <button className="py-3 text-white dark:text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none w-1/2" onClick={onVisualisationCreate}>Create Visualisation</button>
                </div>
            </div>
        <ToastContainer />

        </div>
        <div className="w-full pl-10">
            <h2 className="text-4xl font-bold py-3">Preview Visualisation</h2>
            <div className="w-full h-full">
              {previewLoading && (
                <Lottie animationData={loadingAnimation} loop={true}/>
              )}
              {previewActive && visualisationType === "DonutBarChart" && (
                <div>
                  <DonutBarChart document={previewDocument}
                  labels={testDonutData.labels}
                  collectionNums={testDonutData.collectionNums}
                  calcFunc={testDonutData.function}
                  name={testDonutData.name} />
                </div>
                )}
              {previewActive && visualisationType === "UkMapGL" &&  (
                  <MapVisualisationDeckGL document={previewDocument} collection={heatmapCollection} field={heatmapField} />
                )}
              {previewActive && visualisationType === "LineGraph" && (
                <div>
                  <LineGraph document={previewDocument} />
                </div>
              )}
            </div>

        </div>
    </div>
  );
};

export default CreateVisualisation;
