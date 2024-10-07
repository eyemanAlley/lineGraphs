// import React from 'react'
// import MapVisualisationDeckGL from 'src/app/components/mapVisualisationDeckGL'
// import chroma from "chroma-js";

// const testData = {
//   document: "1701985603482-total-heat-demand-by-la-after-energy-efficiency-measures-csv",
//   collection: "Total-heat-demand-in-2018-before-energy-efficiency-measures-(GWh)",
//   field: "Total heat demand in 2018 before energy efficiency measures (GWh)"
// }

// const testHeatData = {
//   Birmingham: "5000",
//   Leeds: "200"
// }

// const colorScale = chroma.scale(["#ff0000", "#ff8888"]).domain([0, 10]);



// beforeEach(() => { // We can use this to run code before each test such as mounting the component under test
//   cy.mount(<MapVisualisationDeckGL countyHeatData={testHeatData} colorScale={colorScale} minValue={5} drawingBuffer={drawingBuffer}/>)

//   cy.viewport(1000, 1000) // Set the viewport to a fixed size to ensure the map doesnt get cut off
// })

// describe('<MapVisualisationDeckGL />', () => {
//   it('Renders the deck gl map and can see hover yext of allardale', () => {
//     cy.get('#deckgl-overlay').should('have.length', 1) // There should be 1 canvas element
//   })
// })