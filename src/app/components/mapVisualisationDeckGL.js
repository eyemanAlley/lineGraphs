import {state, useState} from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from 'deck.gl';
import GeoData from 'src/app/Data/LA.json';
import WalesData from 'src/app/Data/WLA.json';

export default function MapVisualisationDeckGL({countyHeatData, colorScale, minValue, drawingBuffer}) {

   const initialViewState = { // this is the initial view of the map
    longitude: -3.415,
    latitude: 53.123,
    zoom: 5 * window.innerHeight / 900,
    pitch: 0,
    bearing: 0,
  };

    // Use state to track the current hover information
    const [hoverInfo, setHoverInfo] = useState(null);

    const defaultLayers = regenerateGeojsonLayers();

    return (
        <div className='w-[full] h-[75vh]'>
          <div id="mapDiv" className="w-[75vh] h-full">
        <DeckGL glOptions={{ preserveDrawingBuffer: drawingBuffer }} style={{position:"relative"}} layers={defaultLayers} initialViewState={initialViewState} controller={true} onHover={(info) => {
          if (info.object) {
            setHoverInfo(info);
          }
        }}>
          {hoverInfo && (
            <div className="text-black bg-white/50 backdrop-blur-md rounded-md border-inherit border-solid p-0.5 max-w-fit" style={{position: 'relative', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y + 10}}>
              <div className='p-1'>
                <div className="font-semibold underline">{hoverInfo.object.properties.LAD13NM}</div>
                <div>{countyHeatData[hoverInfo.object.properties.LAD13NM]} kwH</div>
              </div>
        </div>
            
          )}
        </DeckGL>
        </div>
        </div>
  
  
        
    )






    function regenerateGeojsonLayers() {
        //had to move this to a function rather than a const as deck.gl requires new layers every time the component mounts
        return [
          //first we construct the base geographical map layers.
          //this is fine for a single-layer MVP solution. We may want to refactor to have multiple layers
          //per data visualisation later.
          new GeoJsonLayer({
            id: 'geojson-layer-england',
            data: GeoData,
            filled: true,
            extruded: false,
            getElevation: (f) => Math.sqrt(f.properties.valuePerSqm) * 10,
            getFillColor: (f) => getColour(f.properties.LAD13NM),
            updateTriggers: {
              getFillColor: [colorScale]
            },
            getLineColor: [255, 0, 0],
            pickable: true,
            autoHighlight: true,
            highlightColor:[ 122, 160, 4],
            // Get the name of the area and display it on hover
          }),
          new GeoJsonLayer({
            id: 'boundary-layer-england',
            data: GeoData,
            stroked: true, 
            filled: false, 
            lineWidthScale: 5,
            lineWidthMinPixels: 0.5,
            getLineColor: [100, 100, 100], 
            pickable: true,
          }),
          new GeoJsonLayer({
            id: 'geojson-layer-wales',
            data: WalesData,
            filled: true,
            extruded: false,
            getElevation: (f) => Math.sqrt(f.properties.valuePerSqm) * 10,
            getFillColor: (f) => getColour(f.properties.LAD13NM),
            updateTriggers: {
              getFillColor: [colorScale]
            },
            getLineColor: [255, 0, 0],
            pickable: true,
            autoHighlight:true,
            highlightColor:[ 122, 160, 4],
          }),
          new GeoJsonLayer({
            id: 'boundary-layer-wales',
            data: WalesData,
            stroked: true, 
            filled: false, 
            lineWidthScale: 5,
            lineWidthMinPixels: 0.5,
            getLineColor: [100, 100, 100], 
            pickable: true,
          }),
        ]
      }

      function getColour(county) {
        console.log("attempting to get colour for " + county);
        if (countyHeatData[county]) {
          return colorScale(countyHeatData[county]).rgb();
        } else { //no data for local authority name, fall back to minimum value
          return colorScale(minValue).rgb();
        }
        
      }


}