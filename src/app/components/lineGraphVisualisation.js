import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "src/app/config/firebaseInit";
import Lottie from "lottie-react";
import loadingAnimation from "public/lottie/loading-dark.json";
import {checkCache, getCache, setCache, compareCacheTimestamp} from 'src/app/components/dataCache';
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsBoost from "highcharts/modules/boost";

import { rgb } from 'chroma-js';


const LineGraph = ({document, current, colours}) => {
  HighchartsBoost(Highcharts);
  const regex = /[0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  const alphaNumeric = /[^A-Za-z0-9 ]/g;
  const [averageOat, setAverageOat] = useState(null);
  const [after, setAfter] = useState(null);
  const [before, setBefore] = useState(null);
  const [index, setIndex] = useState(null);
  console.log("CHILD document is " + document);
  console.log("CHILD current is " + current);
  console.log("CHILD colours are " + colours);
  console.log("CHILD colour0 is " + colours[0]);
  useEffect(() => {
    getLineGraphData(document, current);
  }, [db]);



  async function getLineGraphData(collectionName, current) {

    const cached = checkCache(collectionName)
    let timestampExpired = compareCacheTimestamp(collectionName,7)
  
    if(current == null){
      console.log("Viewing the latest visualisation")
  
      if(cached && !timestampExpired){
        const cachedData = getCache(collectionName);
        setAverageOat(cachedData.data.averageOat);
        setBefore(cachedData.data.before);
        setAfter(cachedData.data.after);
        setIndex(cachedData.data.index);
  
      }else{
        //get data from firestore
        const csvCollection = collection(db, document);
        const snapshot = await getDocs(csvCollection);
        const averageOatRef = snapshot.docs[0];
        const averageOat = averageOatRef.data();
        const afterRef = snapshot.docs[1];
        const after = afterRef.data();
        const beforeRef = snapshot.docs[2];
        const before = beforeRef.data();
        const indexRef = snapshot.docs[3];
        const index = indexRef.data();
        setAverageOat(averageOat);
        setBefore(before);
        setAfter(after);
        setIndex(index);

        // concatenate data into a single object
        const lineGraphData = {
          averageOat: averageOat,
          before: before,
          after: after,
          index: index
        }
    
        setCache(collectionName, lineGraphData);
    
      }
    }else{
      console.log("Viewing a historic visualisation")
  
      const csvCollection = collection(db, document);
      const snapshot = await getDocs(csvCollection);
      const averageOatRef = snapshot.docs[0];
      const averageOat = averageOatRef.data();
      const afterRef = snapshot.docs[1];
      const after = afterRef.data();
      const beforeRef = snapshot.docs[2];
      const before = beforeRef.data();
      const indexRef = snapshot.docs[3];
      const index = indexRef.data();
      setAverageOat(averageOat);
      setBefore(before);
      setAfter(after);
      setIndex(index);

    }
  }

  const oatValues = JSON.stringify(averageOat).split(",");
  const oatValuesLabel = oatValues.shift().replace(regex, "");
  const oatValuesInts = oatValues.map(function(str) {
    // using map() to convert array of strings to numbers

    return parseFloat(str); });
  const afterValues = JSON.stringify(after).split(",");
  const afterValuesLabel = afterValues.shift().replace(regex, "");
  const afterValuesInts = afterValues.map(function(str) {
    // using map() to convert array of strings to numbers

    return parseFloat(str); });
  const beforeValues = JSON.stringify(before).split(",");
  const beforeValuesLabel = beforeValues.shift().replace(regex, "");
  const beforeValuesInts = beforeValues.map(function(str) {
    // using map() to convert array of strings to numbers

    return parseFloat(str); });
    console.log(oatValues);
    console.log(oatValuesInts);

  
  const HighchartsOptions = {

    xAxis: [{
      visible: false,
    }, {
      categories: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Oct', 'Nov', 'Dec'],
      min: 0,
      max: 7,
      showEmpty: true,
    }],

    title: {
      text: undefined,
    },
    credits: {
      enabled: false
 },
    boost: {
      //Boost enables a separate webGL-based rendering mode to improve performance with large datasets.
      //this is a tradeoff as it disables animations. However, it is necessary due to the large number of data points in the area-type series.
      useGPUTranslations: true,
      seriesThreshold: 1000, //we do not want to enable boosting for the entire chart (the line should not be boosted).
      //there is no property provided to disable chart-level boosting - setting an impossible value is the officially-recommended method of accomplishing this
  },

    yAxis: [{
      title: {
        text: 'Half-hourly ' + afterValuesLabel.match(/^(\S+\s*){1,5}/)[0] + "in " + JSON.stringify(index).replace(alphaNumeric,"").substring(5,9) + " (GWh)"
    }
    }, 
    
    {
      title: {
        text: 'Temperature (deg. Celcius)'
    },
      opposite: true
    }, 
  ],
  tooltip: {

    headerFormat: "", //disables the tooltip header which would otherwise display info from the 'ghost' X axis

  },

    series: [{
      name: oatValuesLabel,
      boostThreshold: 0, //prevents this series from entering boost mode
      allowOverlap: true,
      type: 'line',
      data: oatValuesInts,
      yAxis: 1,
      xAxis: 0,
      zIndex: 1,
      color: colours[0],
      // color: 'rgb(37 99 235)'

  }, {
      name: beforeValuesLabel,
      boostThreshold: 500, //ensures this series will enter boost mode with large datasets
      allowOverlap: true,
      type: 'area',
      data: beforeValuesInts,
      yAxis: 0,
      xAxis: 0,
      color: colours[1],

  }, {
      name: afterValuesLabel,
      boostThreshold: 500, //ensures this series will enter boost mode with large datasets
      allowOverlap: true,
      type: 'area',
      data: afterValuesInts,
      yAxis: 0,
      xAxis: 0,
      color: colours[2],

  }]

  }

  if (averageOat != null && after != null && before != null && index != null) {
  return (
      <div className="w-full">
        <HighchartsReact 
      highcharts={Highcharts} 
      options={HighchartsOptions}/>
      </div>
    );
  }

  return (<Lottie animationData={loadingAnimation} loop={true}/>);
}



LineGraph.defaultProps = {
  current: null,
  document: "none"
};

export default LineGraph;