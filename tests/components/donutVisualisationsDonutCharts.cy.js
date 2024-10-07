import React from 'react'
import DonutBarChart from 'src/app/components/donutBarVisualisations'
import { Chart, ArcElement, Tooltip } from 'chart.js';

const testDonutData = {
  document : "1700136182584-energy-efficiency-csv",
  labels : ["Detached", "Flats", "Semi-detached", "Terraced"],
  collectionNums : [17, 32],
  calcFunc : "calculateDwellingType",
  name : "Breakdown of energy efficiency improvement costs by dwelling type (£)"
}

beforeEach(() => { // Registers the arc element to avoid issues
  Chart.register(ArcElement);

  Chart.register([Tooltip])
})


describe('<DonutBarCharts />', () => {
  it('Renders one donut chart', () => {
    cy.mount(<DonutBarChart document={testDonutData.document} labels={testDonutData.labels} collectionNums={testDonutData.collectionNums} calcFunc={testDonutData.calcFunc} name={testDonutData.name} />)

    cy.get('canvas').should('have.length', 1) // One chart
  })

  it('Renders two donut charts', () => {
    cy.mount(
      <div>
        <DonutBarChart document={testDonutData.document} labels={testDonutData.labels} collectionNums={testDonutData.collectionNums} calcFunc={testDonutData.calcFunc} name={testDonutData.name} />
        <DonutBarChart document={testDonutData.document} labels={testDonutData.labels} collectionNums={testDonutData.collectionNums} calcFunc={testDonutData.calcFunc} name={testDonutData.name} />
      </div>
    )

    cy.get('canvas').should('have.length', 2) // Two charts
  })

  it('Renders three donut charts', () => {
    cy.mount(
      <div>
        <DonutBarChart document={testDonutData.document} labels={testDonutData.labels} collectionNums={testDonutData.collectionNums} calcFunc={testDonutData.calcFunc} name={testDonutData.name} />
        <DonutBarChart document={testDonutData.document} labels={testDonutData.labels} collectionNums={testDonutData.collectionNums} calcFunc={testDonutData.calcFunc} name={testDonutData.name} />
        <DonutBarChart document={testDonutData.document} labels={testDonutData.labels} collectionNums={testDonutData.collectionNums} calcFunc={testDonutData.calcFunc} name={testDonutData.name} />
      </div>
    )

    cy.get('canvas').should('have.length', 3) // Three charts
  })
})
