"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import NavHeader from "src/app/components/navHeader";
import { IoMdRefresh, IoMdDownload, IoMdCamera, IoMdClose, IoMdAdd,IoMdRemove} from "react-icons/io";
import {deleteAllCacheBySuffixCsv} from 'src/app/components/dataCache';
import { motion, useAnimation } from "framer-motion";
import { balthazar } from 'src/app/fonts.ts';
import { exportToImage } from "src/app/components/exportToImage";
import loadingAnimation from 'public/lottie/uk-loading.json';
import scrolldown from 'public/lottie/scrolldown.json';
import Lottie from 'lottie-react';
import dynamic from 'next/dynamic';
import { Link } from 'react-scroll'; 
import { gsap } from "gsap";
import VisualisationLoader from 'src/app/components/contentLoader';
import ColourPicker from 'src/app/components/colourPicker';

// Visualisations
import MapVisualisationContainer from "src/app/components/mapVisualisationContainer";
import LineGraph from "src/app/components/lineGraphVisualisation";
import DonutBarChart from "src/app/components/donutBarVisualisations";
// Firebase
import {getDocumentNamesByCollection, getAllDocumentNameAndDataByCollection} from 'src/app/components/firebaseFetch';
import { set, split } from "lodash";

const Visualisations = () => {
  const [selectedVis, setSelectedVis] = useState("none");
  const [extraVis, setExtraVis] = useState("none");

  // Visualisation names and data.
  const [visualisationNames, setVisualisationNames] = useState([]);
  const [visualisationData, setVisualisationData] = useState({});
  const [visualisationDescriptions, setVisualisationDescriptions] = useState('');

  // Gross way of storing the names and data of the extra visualisations.
  const [extraVisualisationData, setExtraVisualisationData] = useState({});
  const [extraVisualisationDescriptions, setExtraVisualisationDescriptions] = useState('none');

  const [reRender, setReRender] = useState(false); // Hacky way to re-render the visualisation when the user selects a new one.
  const [oldVisualisation, setOldVisualisation] = useState(null);
  const deckRef = useRef();
  const [splitView, setSplitView] = useState(false);

  const [currentColours, setCurrentColours] = useState(["#a3f264", "#fca5a5", "#cc00ff", "#0000ff"])


  const handleColourChange = (newColour, index) =>{

    const updatedColours = currentColours.map((c, i) => {
      if (i === index) {
        return newColour;
      } else {
        return c;
      }
    })
    
    setCurrentColours(updatedColours);

  }

  // Renders the content of the visualisations page based on the selectedVis state.
  // Uses imports from the other visualisations pages. src/app/components/...

  // Fetches the names and data of the visualisations from the database and stores them.
  useEffect(() => {

    document.title = 'CIREGS - Visualisations';
    getDocumentNamesByCollection("visualisations").then((visualisationNames) => {
      setVisualisationNames(visualisationNames);
    });
    getAllDocumentNameAndDataByCollection("visualisations").then((visualisationData) => {
      setVisualisationData(visualisationData);
      console.log(visualisationData)
    });

    gsap.from("#content-wrapper", {opacity: 0, duration: 1, delay: 0.5}); // Make visualisations invisible until the users scrolls.

    window.addEventListener('scroll', onScroll); // Event listener for scrolling. For the fade in animation.

    return () => window.removeEventListener('scroll', onScroll); // Remove event listener when component unmounts.
  }, []);

  useEffect(() => {
    if(extraVis != "none"){
      gsap.fromTo("#vis-description", {opacity: 0, duration: 1}, {opacity: 1, duration: 1});
      setExtraVisualisationDescriptions(Object.values(visualisationData)[parseInt(extraVis)].data.description);
  }

  }, [extraVis, visualisationData]);

    // Fetches the description of the visualisation from the database when the user chooses a visualisation.
    useEffect(() => {
      if (selectedVis != "none") {
        gsap.fromTo("#vis-description", {opacity: 0, duration: 1}, {opacity: 1, duration: 1});
        setVisualisationDescriptions(Object.values(visualisationData)[parseInt(selectedVis)].data.description);
      }
      reRenderVis();
    }, [selectedVis, visualisationData]);





  const reRenderVis = async () => {
    setReRender(true);
    await new Promise(resolve => setTimeout(resolve, 1));
    setReRender(false);
  };

  const handleExportToImage = () => {
    exportToImage();
  }

  const handleSplit = () => {
    setSplitView((prevSplitView) => !prevSplitView);
  };


  // Animations done in gsap
  const onEnterButtonGreen = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#37FF87", scale: 1.05 });
  };

  const onPushButton = ({ currentTarget }) => {
    var tl = gsap.timeline();
    tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 0.95, duration: 0.1, ease: "power1.in" });
    tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 1, duration: 0.1, ease: "power1.out" });
  };
  
  const onLeaveButtonGrey = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#d1d5db", scale: 1 });
  };

  const onLeaveButtonGreen = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#86efac", scale: 1 });
  };

  const onEnterButtonRed = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#ef4444", scale: 1.05 });
  };

  const onLeaveButtonRed = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#f87171", scale: 1 });
  };

  const onScroll = () => {
    if (window.scrollY > window.screen.height/2) {
      gsap.to("#content-wrapper", {opacity: 1, duration: 1});
    }
  };



  // Renders the list of visualisations as buttons.
  var visualisationList = visualisationNames.map((visualisation, index) => (
      <option key={index.toString} value={index.toString()}>
        {visualisation}
      </option>
  ));

  const renderVisualisations = () => {
    if (selectedVis == "none") {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="p-5">
            <Lottie animationData={loadingAnimation} loop={true} style={{ height: 200 }}/>
          </div>
        </div>
      );
    } else {
      let currentVisualisationData = Object.values(visualisationData)[parseInt(selectedVis)];
      let visualisationToDisplay;
      if (oldVisualisation==null) {
        visualisationToDisplay = currentVisualisationData.data.document;
      } else {
        visualisationToDisplay = oldVisualisation;
      }
      switch (currentVisualisationData.data.type)
      {
        case "UkMapGL":
          console.log("CURRENT VISUALISATION DATA BELOW:");
          console.log(currentVisualisationData);
          console.log("CURRENT VISUALISATION NAME IS " + currentVisualisationData.data.name);
          return (
            <div class="w-full h-full flex items-center justify-center">
              {splitView &&
              <MapVisualisationContainer document={visualisationToDisplay} current={oldVisualisation} colours={currentColours} visualisationName={currentVisualisationData.data.name} unit={currentVisualisationData.data.unit}
            />}
            {!splitView &&
              <MapVisualisationContainer document={visualisationToDisplay} current={oldVisualisation} colours={currentColours} visualisationName={currentVisualisationData.data.name} unit={currentVisualisationData.data.unit}
            />}
            {(currentVisualisationData.data.previousDocuments).length > 0 && <SelectDataByDateModal currentVisualisation={currentVisualisationData.data.document} previousDocuments={currentVisualisationData.data.previousDocuments} selectedVisualisation={visualisationToDisplay}></SelectDataByDateModal>
      }
             
             </div>
          );
        case "LineGraph":
          return (
            <div id="" className="w-full h-full items-center justify-center flex p-3">
              <LineGraph document={visualisationToDisplay} current={oldVisualisation} colours={currentColours}/>
              {(currentVisualisationData.data.previousDocuments).length > 0 && <SelectDataByDateModal currentVisualisation={currentVisualisationData.data.document} previousDocuments={currentVisualisationData.data.previousDocuments} selectedVisualisation={visualisationToDisplay}></SelectDataByDateModal>}
            </div>
          );
        case "DonutBarChart":
          return (
            <div id="" className="p-3 h-full">
              <DonutBarChart document={visualisationToDisplay}
              current={oldVisualisation} 
              labels={currentVisualisationData.data.Labels}
              collectionNums={currentVisualisationData.data.collectionNums}
              calcFunc={currentVisualisationData.data.function}
              name={currentVisualisationData.data.name}
              colours={currentColours} />
            {(currentVisualisationData.data.previousDocuments).length > 0 && <SelectDataByDateModal currentVisualisation={currentVisualisationData.data.document} previousDocuments={currentVisualisationData.data.previousDocuments} selectedVisualisation={visualisationToDisplay}></SelectDataByDateModal>}
            </div>
          );
        default:
          return (
          <div className="h-full w-full">
            <div className="p-5 w-full h-full flex items-center">
              <Lottie animationData={loadingAnimation} loop={true} style={{ height: 200 }}/>
            </div>
          </div>
          );
      }
    }
  };

  const renderExtraVisualisations = () => {
    if (extraVis == "none") {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="p-5">
            <Lottie animationData={loadingAnimation} loop={true} style={{ height: 200 }}/>
          </div>
        </div>
      );
    } else {
      let currentVisualisationData = Object.values(visualisationData)[parseInt(extraVis)];
      let visualisationToDisplay;

      visualisationToDisplay = currentVisualisationData.data.document;

      switch (currentVisualisationData.data.type)
      {
        case "UkMapGL":
          return (
            <div className="w-full h-full flex items-center justify-center">
            {splitView &&
            <MapVisualisationContainer deckRef={deckRef} document={currentVisualisationData.data.document} drawingBuffer={false} current={oldVisualisation} colours={currentColours} visualisationName={currentVisualisationData.data.name} unit={currentVisualisationData.data.unit}
          />}
          {!splitView &&
            <MapVisualisationContainer deckRef={deckRef} document={currentVisualisationData.data.document} drawingBuffer={true} current={oldVisualisation} colours={currentColours} visualisationName={currentVisualisationData.data.name} unit={currentVisualisationData.data.unit}
          />}
          {(currentVisualisationData.data.previousDocuments).length > 0 && <SelectDataByDateModal currentVisualisation={currentVisualisationData.data.document} previousDocuments={currentVisualisationData.data.previousDocuments} selectedVisualisation={visualisationToDisplay}></SelectDataByDateModal>
    }
           
           </div>
          );
        case "LineGraph":
          return (
            <div id="" className="w-full h-full items-center justify-center flex p-3">
              <LineGraph document={visualisationToDisplay} current={oldVisualisation} colours={currentColours}/>
              {(currentVisualisationData.data.previousDocuments).length > 0 && <SelectDataByDateModal currentVisualisation={currentVisualisationData.data.document} previousDocuments={currentVisualisationData.data.previousDocuments} selectedVisualisation={visualisationToDisplay}></SelectDataByDateModal>}
            </div>
          );
        case "DonutBarChart":
          return (
            <div id="" className="p-3 h-full">
              <DonutBarChart document={visualisationToDisplay}
              current={oldVisualisation} 
              labels={currentVisualisationData.data.Labels}
              collectionNums={currentVisualisationData.data.collectionNums}
              calcFunc={currentVisualisationData.data.function}
              name={currentVisualisationData.data.name}
              colours={currentColours} />
            {(currentVisualisationData.data.previousDocuments).length > 0 && <SelectDataByDateModal currentVisualisation={currentVisualisationData.data.document} previousDocuments={currentVisualisationData.data.previousDocuments} selectedVisualisation={visualisationToDisplay}></SelectDataByDateModal>}
            </div>
          );
        default:
          return (
          <div className="h-full w-full">
            <div className="p-5 w-full h-full flex items-center">
              <Lottie animationData={loadingAnimation} loop={true} style={{ height: 200 }}/>
            </div>
          </div>
          );
      }
    }
  };


  const onVisualisationSelected = (e) => {setSelectedVis(e.target.value);}



  const handleRefresh = async () => {
    await deleteAllCacheBySuffixCsv("csv");
    window.location.reload();
  }

  const onExtraVisualisationSelected = (e) => {
    setExtraVis(e.target.value);
    reRenderVis();
  }



  return (
    <div>
    <NavHeader />
    <div>
      <div>
        <div className="">
          <video src={`../videos/treebg.mp4`} autoPlay loop muted />
          <div className="absolute bottom-[5%] left-0 ">
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 120, duration: 0.5 }} >
            <h1 className={`${balthazar.className} text-8xl text-[#DDFEBC] pl-6 ml-6 w-[80% font-montserrat`}>Shaping the UK’s renewable energy future, together.</h1>
            <h2 className="text-3xl text-white pl-6 ml-6 pb-6 pt-2 w-[50%] leading-snug font-extralight">Cardiff University is carrying out ground-breaking research, analysing the UK’s energy behaviours</h2>
            <div className="flex pl-6 ml-6 pb-5 pr-6 cursor-pointer">
              <Link to="content" smooth={true} duration={1000} className="group py-2 border-solid border-2 border-white rounded-full hover:bg-customgreen hover:border-customgreen transition-b duration-700 flex items-center">
                <div smooth={true} duration={1000} className="text-2xl text-white px-4  font-light group-hover:text-black">
                  View our work.
                </div>
              </Link>
            </div>
            <Lottie
              animationData={scrolldown}
              loop={true}
              style={{
                position: 'absolute',
                bottom: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                height: 40,
              }}
            />
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
    {/* bg-[#FCF2E5]  */}
    <div className="bg-white p-2">

    </div>
        <div className="h-screen w-[100%] bg-content-img bg-cover" id="content">
          <div className="h-full w-full p-5 flex items-center" id="content-wrapper">
            <div className="bg-white h-[80%] w-full flex rounded-lg">
              <div className="w-[40%] h-full bg-gray-50 rounded-lg flex-col flex">
                <div className="border-b-2 pt-2 bg-white rounded-tl-lg flex-grow" id="title">
                  <h2 className="text-4xl text-black font-bold p-6">Data Visualisations</h2>
                </div>
                <div className="overflow-auto h-[75%]" id="middle-section">
                <div className="p-6">
                  <h2 className="text-2xl text-black p-1 pb-2 font-semibold" >Select a visualisation</h2>
                  {splitView && <p className="text-xs pb-2">Left Visualisation</p>}
                  <select className="w-full text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none" onChange={onVisualisationSelected}>
                    <option value="none" selected="true" disabled="true">Select visualisation</option>
                    {visualisationList}
                  </select>
                  { splitView &&
                  <div>
                  <p className="text-xs pb-2">Right Visualisation</p>
                  <select className="w-full text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none" onChange={onExtraVisualisationSelected}>
                    <option value="none" selected="true" disabled="true">Select visualisation</option>
                    {visualisationList}
                  </select>
                  </div>}
                </div>
                <div className="p-6 border-t-2">
                  <h2 className="text-2xl text-black font-semibold p-1" >What does it mean?</h2>
                  <div>
                      {visualisationDescriptions == '' && (
                        <VisualisationLoader className="pl-1 mt-2"></VisualisationLoader>
                      )}
                      {splitView && <p className="text-sm p-1 underline">Left Visualisation</p>}
                      <h2 className="text-base text-black p-1" id="vis-description">{visualisationDescriptions}</h2>
                      {splitView && 
                      <div>
                      <p className="text-sm p-1 underline">Right Visualisation</p>
                      <h2 className="text-base text-black p-1" id="extra-vis-description">{extraVisualisationDescriptions}</h2>
                      </div>}
                    </div>
                </div>
                </div>
                <div className="pl-6 bg-gray border-t-2 h-[10%] flex items-center" id="tools">
                    <div className="flex py-2 items-center text-center">
                    { selectedVis != 'none' &&  
                    <div className="p-1">
                      {!splitView &&
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                        id="add-section" title="Add Visualisation View" onClick={handleSplit} onMouseEnter={onEnterButtonGreen} onMouseLeave={onLeaveButtonGrey} onMouseDown={onPushButton}>
                          <IoMdAdd size={20}/>
                      </button>}
                      {splitView &&
                      <button
                        className="bg-red-400 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                        id="add-section" title="Add Visualisation View" onClick={handleSplit} onMouseEnter={onEnterButtonRed} onMouseLeave={onLeaveButtonRed} onMouseDown={onPushButton}>
                          <IoMdRemove size={20}/>
                      </button>}
                    </div>
                    }
                    <div className="p-1">
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                        id="downloadbtn" title="Download Dataset" onMouseEnter={onEnterButtonGreen} onMouseLeave={onLeaveButtonGrey} onMouseDown={onPushButton}>
                          <IoMdDownload size={20}/>
                      </button>
                    </div>
                    <div className="p-1">
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                         title="Save to PNG" onClick={handleExportToImage} onMouseEnter={onEnterButtonGreen} onMouseLeave={onLeaveButtonGrey} onMouseDown={onPushButton}>
                          <IoMdCamera size={20}/>
                        </button>
                    </div>
                    <div className="p-1">
                      <ColourPicker
                      currentColours = {currentColours}
                      parentColourUpdate = {handleColourChange}
                      ></ColourPicker>
                      </div>
                    <div className="p-1">
                      <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded inline-flex items-center" id="downloadbtn" title="Refresh Cache" 
                      onClick={handleRefresh} onMouseEnter={onEnterButtonRed} onMouseLeave={onLeaveButtonRed} onMouseDown={onPushButton}>
                          <IoMdRefresh size={20}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[80%] border-l-2 flex items-center">
                <div className={`${splitView ? 'w-[50%] h-full' : 'w-full h-full'}`} id="visualisation">
                  {!reRender && renderVisualisations()}
                </div>
                {splitView && <div className="w-[50%] h-full" id="visualisation-2">{!reRender && renderExtraVisualisations()}</div>}
              </div>
            </div>
          </div>

        </div>
    </div>
  );

  function SelectDataByDateModal({previousDocuments, currentVisualisation, selectedVisualisation}) {

    //const csvCollection = collection(db, document);
  
    //const [modalHidden, setModalHidden] = useState(true);
  

    const [modalVisible, setModalVisible] = useState(false);

    if (modalVisible && !splitView) {
  
    return (

  
      <div className="transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg max-h-96 fixed bottom-0 right-0 overflow-y-auto">
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="items-end absolute right-5">
        <button onClick={() => setModalVisible(false)}><IoMdClose size={20} /></button>
        </div>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-400 sm:mx-0 sm:h-10 sm:w-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(241 245 249)" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Select Dataset</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Latest dataset:</p>
              <button type="button" className={` ${selectedVisualisation==currentVisualisation ? "font-medium text-cyan-500" : ""}`} id={currentVisualisation} onClick={() => displayCurrentData()}>{Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(currentVisualisation.split("-", 1)[0])}</button>
              <p className="text-sm text-gray-500">Previous datasets:</p>
              {previousDocuments.map(x=> <button key={x} className={` ${selectedVisualisation==x ? "font-medium text-cyan-500" : ""}`} type="button" id={x} onClick={() => displayOldData(x)}>{Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(x.split("-", 1)[0])}</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>

    
    )
  } else {
    return (

<button type="button" onClick={() => setModalVisible(true)} className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 fixed bottom-0 right-0">
<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-400 sm:mx-0 sm:h-10 sm:w-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(241 245 249)" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          </div>
<span className="pl-3 text-base font-semibold leading-6 text-gray-900">Change Dataset</span>
</button>

    )
  }

}



  function displayOldData(newDataset) {
    setOldVisualisation(newDataset);
    reRenderVis();
  }

  function displayCurrentData(newDataset) {
    setOldVisualisation(null);
    reRenderVis();
  }
  
}







;
export default Visualisations;
