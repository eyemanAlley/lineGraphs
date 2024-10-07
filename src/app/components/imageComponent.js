import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import loadingAnimation from "public/lottie/loading-dark.json";

const ImageComponent = ({ src, placeholderSrc, alt, width, height }) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageSrc(src);
  }, [src]);  //replaces placeholder image when the image to be displayed is ready

  if (imageSrc != placeholderSrc) {
   return <img src={imageSrc} alt={alt} width={width} height={height} />
  }

  return (
    <>
      <img src={imageSrc} alt={alt} width={width} height={height} />
      <Lottie animationData={loadingAnimation} loop={true} />
    </>
  )

};

export default ImageComponent;

// this image component is used because next/images don't work with static pages (generated with next export)