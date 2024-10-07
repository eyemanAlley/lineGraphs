import React, { useEffect, useState} from 'react';
import { db } from "src/app/config/firebaseInit.js";
import {collection, getDocs} from 'firebase/firestore'
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from 'deck.gl';
import GeoData from 'src/app/Data/LA.json';
import WalesData from 'src/app/Data/WLA.json';
import chroma from "chroma-js";
import Lottie from "lottie-react";
import loadingAnimation from "public/lottie/loading-dark.json";
import { fromPairs, toPairs, zipObject} from 'lodash';
import {checkCache, getCache, setCache, compareCacheTimestamp} from 'src/app/components/dataCache';
import MapVisualisationTable from 'src/app/components/mapVisualisationTable';
import ToggleButton from './toggleButton';
import MapVisualisationDeckGL from 'src/app/components/mapVisualisationDeckGL';
import MapVisualisationKey from './mapVisualisationKey';

 let countyHeatData;  //this is set by the async function in useEffect() block
 let defaultLayers;


//the below are all set either directly or indirectly in the useEffect() function
let colorScale;
let maxValue;
let minValue;


//some hardcoded styling properties to get around Tailwind not having full-255 colours.
//this could be refactored later to be based on the colorscale as part of colourblind support.

const scaleStyle = {
  backgroundColor: 'red',
};

const scaleMinBackgroundColor = {
  backgroundColor: 'blue',
};

const keyBackgroundGradient = {
  
}


let lowColour;
let highColour;
let scaleGradientColoursClassString;


export default function MapVisualisationContainer({document, current, colours, visualisationName, unit, drawingBuffer}) {
  console.log("MAP visualisation name is  " + visualisationName);

  lowColour = colours[0];
  highColour = colours[1];
  scaleGradientColoursClassString = "linear-gradient(to top, " + lowColour + ", " + highColour + ")";

  const [countyDataFulfilled, setCountyDataFulfilled] = useState(false);
  const [tableMode, setTableMode] = useState(false);

  //we use the following to run the data fetching code asynchronously

 

  useEffect(() => {
    console.log("useEffect running");
    console.log("lowColour is " + lowColour);
    console.log("highColour is " + highColour);
    const getAsyncCountyData = async () => {
      const data = await getCountyHeatData(document, current);
      countyHeatData = data;
      let rawHeatNumbers = Object.values(data);
      const sanitisedRawHeatNumbers = rawHeatNumbers.filter(value => /^-?\d+\.?\d*$/.test(value));
      //console.log(sanitisedRawHeatNumbers); //makes sure any trailing empty values are removed
      //without this it is possible for an empty field to force clamp the scale to 0
      //although this should be combined with extra sanitisation at the csv processing stage as well
      console.log("LOGGING COUNTY HEAT DATA BELOW");
      console.log(countyHeatData);
      minValue = Math.min(...sanitisedRawHeatNumbers);
      maxValue = Math.max(...sanitisedRawHeatNumbers);
      colorScale = chroma.scale([lowColour, highColour]).domain([minValue, maxValue]);
  

      //we set the colorScale to be a gradient from blue through to red, and the domain (scale) to be from the real min and max
      setCountyDataFulfilled(true);  
      
      
      return () => {
        //cleanup code
        const cleanupFunction = () => {
          console.log("running cleanup");
          setCountyDataFulfilled(false);
        }
    }
    }
  
    getAsyncCountyData()
      //catch errors
      .catch(console.error);
  }, [colours])



  function toggleView() {
    console.log("toggling view to " + !tableMode);
    setTableMode(!tableMode);
  }


  // The properties names are stored in the GeoJSON file as LAD13NM.

  if (countyDataFulfilled && !tableMode) { //prevents rendering until the useEffect() block has fulfilled async promises

    return (

      <div id="mapDiv" class="relative max-h-full w-full overflow-auto">

      <ToggleButton text="View as Table" onClickReportFunc={toggleView}/>
        

      <MapVisualisationDeckGL countyHeatData={countyHeatData} colorScale={colorScale} minValue={minValue} drawingBuffer={drawingBuffer}/>
      <MapVisualisationKey lowColour={lowColour} highColour={highColour} minValue={minValue} maxValue={maxValue} unit={unit}>
        </MapVisualisationKey>

      </div>

    )


  } else if (countyDataFulfilled && tableMode) {
    
    return (
      <div id="tableDiv" class="max-h-full w-full overflow-auto">

          <ToggleButton text="View on Map" onClickReportFunc={toggleView}/>

          <MapVisualisationTable countiesDict={countyHeatData} colourScale = {colorScale} visualisationName={visualisationName}></MapVisualisationTable>

    </div>

    )
  }


  return <Lottie animationData={loadingAnimation} loop={true}/>;


}

async function getCountyHeatData(collectionName, current) {

  const cached = checkCache(collectionName)

  if(current == null){
    let timestampExpired = compareCacheTimestamp(collectionName,7)

    if(cached && !timestampExpired){
      const cachedData = getCache(collectionName);
      return cachedData.data.countyHeatDict;

    }else{
      console.log("PERFORMING DATABASE PULL");
      //get data from firestore
      const csvCollection = collection(db, collectionName);
      const snapshot = await getDocs(csvCollection);
      const dataDoc = snapshot.docs[1].data();
      const countyDoc = snapshot.docs[0].data();
      const dataDocData = dataDoc[Object.keys(dataDoc)[0]].split(",");
      const countyDocData = countyDoc[Object.keys(countyDoc)[0]].split(",");
      const trimmedDataDocData = dataDocData.map(str => str.trim());
      const trimmedCountyDocData = countyDocData.map(str => str.trim());
      const countyHeatDict = zipObject(trimmedCountyDocData, trimmedDataDocData);

      const dataWrite = Date.now();
  
      setCache(collectionName, {countyHeatDict, dataWrite});
  
      return countyHeatDict;
    }
  }else{

    const csvCollection = collection(db, collectionName);
    const snapshot = await getDocs(csvCollection);
    const dataDoc = snapshot.docs[1].data();
    const countyDoc = snapshot.docs[0].data();
    const dataDocData = dataDoc[Object.keys(dataDoc)[0]].split(",");
    const countyDocData = countyDoc[Object.keys(countyDoc)[0]].split(",");
    const countyHeatDict = zipObject(countyDocData, dataDocData);
    return countyHeatDict;
  }
}
