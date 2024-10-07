import React from "react";

const HazardTape = () => { 
    return (
      <div class="" style={{ width: '100%' }}>
      <svg width="100%" height="10" viewBox="0 0 30 1" preserveAspectRatio="none">
        <pattern id="hazardPattern" width="2" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <rect width="1" height="3" fill="#FFFF00"></rect>
          <rect width="1" height="3" transform="translate(1,0)" fill="#000"></rect>
        </pattern>
        <rect width="100%" height="2" fill="url(#hazardPattern)"></rect>
      </svg>
    </div>
    
  );
};

export default HazardTape;