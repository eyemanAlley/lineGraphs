import React from 'react'
import LineGraph from 'src/app/components/lineGraphVisualisation'


describe('<LineGraph />', () => {
  it('Renders a heat gasboiler line graph', () => {
    cy.mount(<LineGraph document="1701281304574-heat-gasboiler-csv" colours={["#ff0000", "#ff0000", "#ff0000", "#ff0000"]} />)

    cy.get('svg').should('have.class', "highcharts-root") // One chart
  })
  it('Renders a gas gasboiler line graph', () => {
    cy.mount(<LineGraph document="1701281345562-gas-gasboiler-csv" colours={["#ff0000", "#ff0000", "#ff0000", "#ff0000"]}/>)

    cy.get('svg').should('have.class', "highcharts-root") // One chart
  })
  it('Renders a heat heater line graph', () => {
    cy.mount(<LineGraph document="1701281372113-heat-heater-csv" colours={["#ff0000", "#ff0000", "#ff0000", "#ff0000"]}/>)

    cy.get('svg').should('have.class', "highcharts-root" ) // One chart
  })
  it('Renders an electricity heater line graph', () => {
    cy.mount(<LineGraph document="1701281396834-electricty-heater-csv" colours={["#ff0000", "#ff0000", "#ff0000", "#ff0000"]}/>)

    cy.get('svg').should('have.class', "highcharts-root") // One chart
  })
 
})