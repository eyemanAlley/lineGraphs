import React from "react"
import ContentLoader from "react-content-loader"

const VisualisationLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={476}
    height={124}
    viewBox="0 0 476 124"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="410" height="15" /> 
    <rect x="0" y="25" rx="3" ry="3" width="410" height="15" /> 
    <rect x="0" y="50" rx="3" ry="3" width="410" height="15" />
    <rect x="0" y="75" rx="3" ry="3" width="410" height="15" /> 
    <rect x="0" y="100" rx="3" ry="3" width="410" height="15" />
  </ContentLoader>
)

export default VisualisationLoader



