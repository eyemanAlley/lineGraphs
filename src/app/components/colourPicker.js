import React, { useEffect, useState} from 'react';
import { HexColorPicker } from "react-colorful";
import { PiPaintBrushLight } from "react-icons/pi";
import { MdBrush } from "react-icons/md";
import { gsap } from "gsap";

export default function ColourPicker({currentColours, parentColourUpdate, selectedVisualisationType}) {

    // function parentColourUpdateWrapper(evt, index) {

    //     parentColourUpdate(evt, index);

    // }

    let currentColoursTempHardcoded = ["#aabbcc", "#bbbbcc", "#ccccc"];

    const [modalVisible, setModalVisible] = useState(false);

    const onEnterButtonGreen = ({ currentTarget }) => {
      gsap.to(currentTarget, { backgroundColor: "#37FF87", scale: 1.05 });
    };

    const onLeaveButtonGrey = ({ currentTarget }) => {
      gsap.to(currentTarget, { backgroundColor: "#d1d5db", scale: 1 });
    };

    const onPushButton = ({ currentTarget }) => {
      var tl = gsap.timeline();
      tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 0.95, duration: 0.1, ease: "power1.in" });
      tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 1, duration: 0.1, ease: "power1.out" });
    };
  
  


    if (modalVisible) {

    return (


        <div className="transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-max max-h-96 fixed bottom-0 left-0 overflow-y-auto z-50">
        <div className="bg-white dark:bg-slate-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-400 sm:mx-0 sm:h-10 sm:w-10">
            <MdBrush size={20}/>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Colour Picker</h3>
              <button onClick={() => updateModalVisibility(false)} class="float-right"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg></button>
              <div className="mt-2 grid grid-cols-4 gap-4">
                <div>
                    <p className="text-base text-gray-950">Colour A:</p>
                    <p className="text-sm text-gray-500">Chart items, map &apos;low&apos; gradient</p>
                    <div class="pt-3">
                    <HexColorPicker color={currentColours[0]} onChange={(evt) => parentColourUpdate(evt, 0)} />
                    </div>
                </div>
                <div>
                    <p className="text-base text-gray-950">Colour B:</p>
                    <p className="text-sm text-gray-500">Chart items, map &apos;high&apos; gradient</p>
                    <div class="pt-3">
                    <HexColorPicker color={currentColours[1]} onChange={(evt) => parentColourUpdate(evt, 1)} />
                    </div>
                </div>
                <div>
                    <p className="text-base text-gray-950">Colour C:</p>
                    <p className="text-sm text-gray-500">Chart items</p>
                    <div class="pt-3">
                    <HexColorPicker color={currentColours[2]} onChange={(evt) => parentColourUpdate(evt, 2)} />
                    </div>
                </div>
                <div>
                    <p className="text-base text-gray-950">Colour D:</p>
                    <p className="text-sm text-gray-500">Chart items</p>
                    <div class="pt-3">
                    <HexColorPicker color={currentColours[3]} onChange={(evt) => parentColourUpdate(evt, 3)} />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )

    } else {

        return (

            <div>
                    <button onClick={() => updateModalVisibility(true)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" title="Change visualisation colours" onMouseEnter={onEnterButtonGreen} onMouseLeave={onLeaveButtonGrey} onMouseDown={onPushButton}>
                    <MdBrush size={20}/>
                    </button>
            </div>
            
                )
    }

    function updateModalVisibility(stateToSet) {

        setModalVisible(stateToSet);
        
    }

    function updateColours(newColour, arrayIndex) {
        console.log(newColour);
    }

}