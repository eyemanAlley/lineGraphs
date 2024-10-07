export default function MapVisualisationKey({unit, lowColour, highColour, minValue, maxValue}) {

    const  scaleGradientColoursClassString = "linear-gradient(to top, " + lowColour + ", " + highColour + ")";

    return (

        <div id="keyContainer" className="h-full flex absolute top-0 right-0">
  
        <div id="key" className="h-52 w-52 flex flex-row pt-2">
          <div id="key-text" className="flex flex-col justify-between">
            <div className="justify-self-start flex flex-row justify-end pr-1">
              <p className="text-right">{maxValue.toFixed(2)} {unit}</p>
            </div>
          <div className="justify-self-end flex flex-row justify-end pr-1">
            <p className="text-right">{minValue.toFixed(2)} {unit}</p>
            </div>
        </div>
          <div id="key-container" class="rounded-lg border-2 border-inherit border-solid h-52 w-3/12 flex flex-col">
            <div id="key-colours" style={{height: "100%", width: "100%", backgroundImage: scaleGradientColoursClassString}}>
            <p></p>
            </div>
          </div>
        </div>
  
        </div>
    )




}