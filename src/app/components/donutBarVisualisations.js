import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { db } from "src/app/config/firebaseInit";
import { collection, getDocs } from 'firebase/firestore';
import Lottie from "lottie-react";
import loadingAnimation from "public/lottie/loading-dark.json";
import {checkCache, getCache, setCache, compareCacheTimestamp} from 'src/app/components/dataCache';
import { Chart, registerables } from 'chart.js';
import { MdBarChart, MdPieChart } from "react-icons/md";
import { gsap } from "gsap";

export default function DonutBarChart({document, labels = [], collectionNums = [], calcFunc = "", name="", current, colours}) {
  // Seperate data sets for each chart
  const [dataSet, setDataSet] = useState([]);
  const [donutOrBar, setDonutOrBar] = useState(true); // True = Donut, False = Bar

  const onEnterButtonGreen = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#5aa11d", scale: 1.05 });
  };

  const onPushButton = ({ currentTarget }) => {
    var tl = gsap.timeline();
    tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 0.95, duration: 0.1, ease: "power1.in" });
    tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 1, duration: 0.1, ease: "power1.out" });
  };
  
  const onLeaveButtonGrey = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#d1d5db", scale: 1 });
  };


  // Get data from firebase store
  useEffect(() => {
    Chart.register(...registerables);
    getDonutChartData(document, current);
  }, [document]);


  async function getDonutChartData(collectionName, current) {
    // get substring to add numbers infront of the name
    let keyTimestamp = collectionName.substring(0, collectionName.indexOf("-"));
    let cacheName = keyTimestamp+"-"+name.toLowerCase().replace(/%/g,'').replace(/\s+/g, '-').replace(/[^a-z0-9-%]/g, '')+"csv";

    const cached = checkCache(cacheName)
    let lineGraphData = [];  
    if(current == null){
      console.log("Viewing the latest visualisation")
      let timestampExpired = compareCacheTimestamp(collectionName,7)
  
      if(cached && !timestampExpired){
        const cachedData = getCache(cacheName);
        // set data if it cached
        setDataSet(cachedData.data);
  
      }else{
        const setCollection = collection(db, document);

        const collectionSnapshot = await getDocs(setCollection);
        switch(calcFunc){
          case "calculateTechnology":
            lineGraphData = calculateTechnology(collectionSnapshot, collectionNums);
            setDataSet(lineGraphData);
            setCache(cacheName, lineGraphData);
            break;
          case "calculateDwellingType":
            lineGraphData = calculateDwellingType(collectionSnapshot, collectionNums);
            setDataSet(lineGraphData);
            setCache(cacheName, lineGraphData);
            break;
          case "calculateRurality":
            lineGraphData = calculateRurality(collectionSnapshot);
            setDataSet(lineGraphData);
            setCache(cacheName, lineGraphData);
            break;
          default:
            if(collectionNums.length > 0){ // No collection nums means the data are stored in a single column, each row is a different data point
              lineGraphData = calculateOther(collectionSnapshot, collectionNums);
              setDataSet(lineGraphData);
              setCache(cacheName, lineGraphData);
            } else {
              lineGraphData = Object.values(collectionSnapshot.docs[0].data())[0].split(","); // Otherwise, the columns should be a total of all the data
              setDataSet(lineGraphData);
              setCache(cacheName, lineGraphData);
            }
        }
    
      }
    }else{
      console.log("Viewing a historic visualisation")
  
      const setCollection = collection(db, document);

      // Get a snapshot of the collection
      const collectionSnapshot = await getDocs(setCollection);
  
      switch(calcFunc){
        case "calculateTechnology":
          setDataSet(calculateTechnology(collectionSnapshot, collectionNums));
          break;
        case "calculateDwellingType":
          setDataSet(calculateDwellingType(collectionSnapshot, collectionNums));
          break;
        case "calculateRurality":
          setDataSet(calculateRurality(collectionSnapshot));
          break;
        default:
          if(collectionNums.length > 0){ // No collection nums means the data are stored in a single column, each row is a different data point
            setDataSet(calculateOther(collectionSnapshot, collectionNums));
          } else {
            setDataSet(Object.values(collectionSnapshot.docs[0].data())[0].split(",")); // Otherwise, the columns should be a total of all the data
          }
      }

    }
  }


  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: name,
      }
    }
  }

  const donutData = {
    labels: labels,
    datasets: [
      {
        label: "Amount: ",
        data: dataSet,
        backgroundColor: colours,
        borderColor: colours,
        borderWidth: 1
      }
    ]
  }

  if(dataSet.length > 0){
    return (
      <div className='h-full'>
        <button className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center' 
        onMouseEnter={onEnterButtonGreen}
        onMouseLeave={onLeaveButtonGrey}
        onMouseDown={onPushButton}
        onClick={() => setDonutOrBar(!donutOrBar)}>
          {donutOrBar ? (
            <MdBarChart />
          ) : (
            <MdPieChart />
          )}
        </button>
        <div className='h-[95%]'>{donutOrBar ? <Doughnut data={donutData} options={donutOptions} /> : <Bar data={donutData} options={donutOptions} />}</div>
      </div>
    );
  } 
  return (<Lottie animationData={loadingAnimation} loop={true}/>);
}

function calculateOther(snapshotOfCollection, collectionNums = []){ // This function is used for the other charts that don't need a custom function
  let otherCount = [];
  for(let i = 0; i <= collectionNums.length; i++){
    const otherList = Object.values(snapshotOfCollection.docs[collectionNums[i]].data())[0].split(",")
    otherCount.push(0);
    for(const num of otherList){
      if(num != ""){
        otherCount[i] += parseInt(num);
      }
    }
  }
  return otherCount;
}

function calculateTechnology(snapshotOfCollection, collectionNums = []){
    let technologyCount = [0, 0, 0, 0]; // [0] Biomass, [1] Gas, [2] Oil, [3] Resistance Heaters

    const initI = collectionNums[0];
    const endI = collectionNums[1];

    for(let i = initI; i <= endI; i++){
      const techList = Object.values(snapshotOfCollection.docs[i].data())[0].split(",")
      for(const num of techList){
        if(num != ""){
          technologyCount[i % 4] += parseInt(num); // i % 4 will always be between 0 and 3, which correctly cycles through the 4 technologies
        }
      }
    }

    return technologyCount;
}

function calculateDwellingType(snapshotOfCollection, collectionNums = []){
  let dwellingCount = [0, 0, 0, 0]; // [0] Detached, [1] Flats, [2] Semi-Detached, [3] Terraced

  const initI = collectionNums[0];
  const endI = collectionNums[1];

  for(let i = initI; i <= endI; i++){
    const dwellingList = Object.values(snapshotOfCollection.docs[i].data())[0].split(",")
    for(const num of dwellingList){
      if(num != ""){
        if(i <= initI + 3){
          dwellingCount[0] += parseInt(num);
        } else if(i <= initI + 7){
          dwellingCount[1] += parseInt(num);
        } else if(i <= initI + 11){
          dwellingCount[2] += parseInt(num);
        } else {
          dwellingCount[3] += parseInt(num);
        }
      }
    }
  }

  return dwellingCount;
}

function calculateRurality(snapshotOfCollection){

  const ruralityList = Object.values(snapshotOfCollection.docs[53].data())[0].split(",")

  let ruralityCount = [0, 0, 0]; // [0] Urban, [1] Village, [2] Hamlet & Isolated Dwellings

  for (const rurality of ruralityList){
    switch(rurality){
      case "Urban":
        ruralityCount[0]++;
        break;
      case "Village": // Village, Town and Fringes gets split into simply Village due to the comma based splitting.
        ruralityCount[1]++;
        break;
      case "Hamlet & Isolated Dwellings":
        ruralityCount[2]++;
        break;
    }
  }

  return ruralityCount;
}