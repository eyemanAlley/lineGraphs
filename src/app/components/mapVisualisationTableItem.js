import chroma from "chroma-js";

export default function MapVisualisationTableData({countyData, colourScale}) {

    return (

        <tr style={{backgroundColor: colourScale(countyData.value)}}><td>{countyData.key}</td><td>{countyData.value}</td></tr>

    )
}