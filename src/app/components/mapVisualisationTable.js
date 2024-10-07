import React, { useEffect, useState} from 'react';
import { values, keys, toArray } from 'lodash';
import chroma from "chroma-js";
import MapVisualisationTableData from 'src/app/components/mapVisualisationTableItem';
import MapVisualisationTableHeaderItem from 'src/app/components/mapVisualisationTableHeaderItem';
import { MdSportsHockey } from 'react-icons/md';

export default function MapVisualisationTable({countiesDict, colourScale, visualisationName}) {
    console.log("TABLE visualisation name is " + visualisationName);

    const [sortHeader, setSortHeader] = useState("value"); //is set to 'key when we want to sort by key (name)
    const [sortAsc, setSortAsc] = useState(false); //starts descending, set to true to sort ascending
    

    const countiesArrayObj = [];

    for (const [key, value] of Object.entries(countiesDict)) {

        let valueToSet = "No data provided"
        if (!Number.isNaN(value)) {

            valueToSet = parseFloat(value);
        }

            countiesArrayObj.push({
                key: key,
                value: valueToSet
            })
    
      }


  
      console.log("sorting on" + sortHeader);


    switch (sortAsc) {
        case true:
            console.log("sorting ascending");
            countiesArrayObj.sort((a, b) => (a[sortHeader] > b[sortHeader]) ? 1 : -1);
            break;
        case false:
            console.log("sorting descending");
            countiesArrayObj.sort((a, b) => (a[sortHeader] > b[sortHeader]) ? -1 : 1);
            break;

    }

      
      console.log("NOW SORTED");
      console.log(countiesArrayObj);

      function headerSelected(selectedHeaderName) {
        console.log("You clicked " + selectedHeaderName);

        if (sortHeader == selectedHeaderName) {
            console.log("inverting sort direction");

            //this header was already selected, so we just need to invert the sort direction (asc/desc)
            setSortAsc(!sortAsc);
        } else {
            console.log("changing header selection");
            //this header wasn't selected, so update selected header and preserve sort direction

            setSortHeader(selectedHeaderName)
        }

      }


    return (
 
        <div class="h-full">

        <table class="table-auto w-full">
            <thead class="sticky top-0 bg-slate-100">
                <tr class="cursor-pointer">
                    <MapVisualisationTableHeaderItem text="Local Authority" headerName={"key"} sortHeader={sortHeader} sortAsc={sortAsc} reportClickFunc={headerSelected}/>
                    <MapVisualisationTableHeaderItem text={visualisationName} headerName={"value"} sortHeader={sortHeader} sortAsc={sortAsc} reportClickFunc={headerSelected}/>
                </tr>
            </thead>
            <tbody>
            {countiesArrayObj.map(x=><MapVisualisationTableData key={x} countyData={x} colourScale={colourScale}></MapVisualisationTableData>)}
            </tbody>


        </table>
            


        </div>

    )


}