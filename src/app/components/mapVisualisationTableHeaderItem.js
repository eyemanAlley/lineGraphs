import React, { useEffect, useState} from 'react';
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";

export default function MapVisualisationTableHeaderItem({text, sortHeader, headerName, sortAsc, reportClickFunc}) {
    console.log(headerName + " HEADER TEXT IS " + text);

    function handleClick() {

        console.log("child clicked");
        reportClickFunc(headerName);

    }

    if (sortHeader==headerName) {

        //this header is selected, so we render and evaluate correct icon

        return (

           
                    <th onClick={() => handleClick()}>
                        
                    <div class="flex">

                        {text}

                    <div class="float-right">

                    {sortAsc == false && <FaArrowAltCircleUp/>}{sortAsc == true && <FaArrowAltCircleDown/>} 

                    </div>

                    </div>

                    </th>



    
        )
    } else {

    return (

        //this header isn't selected, so we just render text

            <th onClick={() => handleClick()}>{text} 

            <div class="float-right">

        
            {sortAsc == false && <FaRegArrowAltCircleUp/>}{sortAsc == true && <FaRegArrowAltCircleDown/>} 

            </div>

            </th>

    )

}

}

