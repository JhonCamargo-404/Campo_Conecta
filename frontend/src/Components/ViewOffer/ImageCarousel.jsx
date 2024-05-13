import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="flex justify-between items-center w-2/5 h-60 mx-auto my-5">
      <button onClick={goToPrevious} className="p-2.5 cursor-pointer">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="w-full h-full bg-center bg-contain bg-no-repeat"
           style={{ backgroundImage: `url(${images[currentIndex]})` }}>
      </div>
      <button onClick={goToNext} className="p-2.5 cursor-pointer">
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default ImageCarousel;
