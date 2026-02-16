import React, { useState } from "react";

const ImageWithPlaceholder = ({ src, alt, aspectRatio = 0.75 }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const wrapperStyle = {
    position: "relative",
    height: 0,
    overflow: "hidden",
    paddingBottom: `${aspectRatio * 100}%`,
    backgroundColor: "#f0f0f0", // A placeholder color
  };

  const imageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: isLoaded ? 1 : 0,
    transition: "opacity 0.5s ease-in",
  };

  return (
    <div style={wrapperStyle}>
      <img src={src} alt={alt} style={imageStyle} onLoad={() => setIsLoaded(true)} />
    </div>
  );
};

export default ImageWithPlaceholder;
