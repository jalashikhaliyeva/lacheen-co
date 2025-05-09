import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

// Utility function to prevent default for passive events
const preventDefault = (e) => {
  if (e.cancelable) {
    e.preventDefault();
  }
};

const ProductDetailedSlider = () => {
  // Sample images for demonstration
  const images = [
    "/images/13.jpg",
    "/images/14.jpg",
    "/images/15.jpg",
    "/images/16.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);

  // Zoom functionality
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const zoomScale = 3; // Fixed zoom magnification level (300%)
  const imageRef = useRef(null);
  const zoomContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  useEffect(() => {
    setCurrentTranslate(-currentIndex * 100);
  }, [currentIndex]);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    // Skip touch events when hovering (zoom mode)
    if (isHovering) return;

    const isTouchEvent = e.touches !== undefined;
    const touchCount = isTouchEvent ? e.touches.length : 1;

    if ((isTouchEvent && touchCount === 1) || !isTouchEvent) {
      const touchX = isTouchEvent ? e.touches[0].clientX : e.clientX;
      setStartX(touchX);
      setIsDragging(true);
      setDragOffset(0);

      if (!isTouchEvent) {
        e.preventDefault();
      }
    }
  };

  const handleTouchMove = (e) => {
    if (isHovering || !isDragging) return;

    const isTouchEvent = e.touches !== undefined;
    const touchCount = isTouchEvent ? e.touches.length : 1;

    if ((isTouchEvent && touchCount === 1) || !isTouchEvent) {
      const touchX = isTouchEvent ? e.touches[0].clientX : e.clientX;
      const diff = startX - touchX;
      const containerWidth = sliderRef.current?.offsetWidth || 1;

      const dragPercentage = (diff / containerWidth) * 100;
      setDragOffset(dragPercentage);

      if (Math.abs(diff) > 5) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || isHovering) return;

    const threshold = 15;

    if (dragOffset > threshold && currentIndex < images.length - 1) {
      goToNext();
    } else if (dragOffset < -threshold && currentIndex > 0) {
      goToPrev();
    }

    setIsDragging(false);
    setStartX(null);
    setDragOffset(0);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (e) => {
    if (!isHovering || !imageRef.current) return;

    const image = imageRef.current;
    const imageRect = image.getBoundingClientRect();

    const x = e.clientX - imageRect.left;
    const y = e.clientY - imageRect.top;

    const xPercent = (x / imageRect.width) * 100;
    const yPercent = (y / imageRect.height) * 100;

    const boundedX = Math.max(0, Math.min(100, xPercent));
    const boundedY = Math.max(0, Math.min(100, yPercent));

    setZoomPosition({ x: boundedX, y: boundedY });
  };

  const finalTranslate = currentTranslate - dragOffset;

  return (
    <div className="w-full mx-auto md:mb-20">
      {/* Main image container */}
      <div className="relative ">
        {/* Main slider */}
        <div
          ref={sliderRef}
          className={`relative w-full  overflow-hidden h-full ${
            isDragging && !isHovering
              ? "cursor-grabbing"
              : isHovering
              ? "cursor-crosshair"
              : "cursor-grab"
          }`}
          onTouchStart={isHovering ? null : handleTouchStart}
          onTouchMove={isHovering ? null : handleTouchMove}
          onTouchEnd={isHovering ? null : handleTouchEnd}
          onMouseDown={isHovering ? null : handleTouchStart}
          onMouseMove={(e) => {
            if (isHovering) {
              handleMouseMove(e);
            } else {
              handleTouchMove(e);
            }
          }}
          onMouseUp={isHovering ? null : handleTouchEnd}
          onMouseLeave={(e) => {
            handleMouseLeave();
            if (!isHovering) handleTouchEnd(e);
          }}
          onMouseEnter={handleMouseEnter}
        >
          <div
            className="flex absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${finalTranslate}%)`,
              transition: isDragging ? "none" : "transform 300ms ease-out",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-full h-full"
              >
                <div className="relative w-full h-full">
                  <Image
                    ref={index === currentIndex ? imageRef : null}
                    priority
                    quality={100}
                    width={500}
                    height={600}
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-contain object-center select-none"
                    draggable="false"
                  />

                  {/* Zoom lens indicator */}
                  {index === currentIndex && isHovering && (
                    <div
                      className="absolute border-2 border-white rounded-sm  pointer-events-none z-10"
                      style={{
                        width: "80px",
                        height: "80px",
                        left: `calc(${zoomPosition.x}% - 40px)`,
                        top: `calc(${zoomPosition.y}% - 40px)`,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zoom preview area - appears on hover */}
        {isHovering && (
          <div
            ref={zoomContainerRef}
            className="hidden md:block absolute top-[100px] left-[600px] ml-4 w-2/3 h-[350px] border-l border-gray-200 bg-white  z-10"
          >
            <div
              className="w-full h-full bg-no-repeat"
              style={{
                backgroundImage: `url(${images[currentIndex]})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: `${zoomScale * 100}%`,
                transition: "background-position 0.1s ease-out",
              }}
            />
          </div>
        )}

        {/* Navigation arrows - only show when not hovering */}
        {!isHovering && currentIndex > 0 && (
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full  flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out hover:bg-opacity-100 text-neutral-600 z-10"
            onClick={goToPrev}
            aria-label="Previous image"
          >
            <SlArrowLeft size={20} />
          </button>
        )}

        {!isHovering && currentIndex < images.length - 1 && (
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-opacity-70 flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out hover:bg-opacity-100 text-neutral-600  z-10"
            onClick={goToNext}
            aria-label="Next image"
          >
            <SlArrowRight size={20} />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-4 gap-2 overflow-x-auto px-4">
        {images.map((image, index) => (
          <button
            key={index}
            className={`w-16 h-16 flex-shrink-0 border-2 rounded transition-all duration-200 ${
              index === currentIndex
                ? "border-neutral-500 "
                : "border-transparent hover:border-neutral-300"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to image ${index + 1}`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
          </button>
        ))}
      </div>

      {/* Indicator showing current slide number */}
      {/* <div className="text-center mt-2 text-sm text-gray-500">
        {currentIndex + 1} / {images.length}
        {isHovering && (
          <span className="ml-2 text-blue-500">Zoom {zoomScale * 100}%</span>
        )}
      </div> */}
    </div>
  );
};

export default ProductDetailedSlider;
