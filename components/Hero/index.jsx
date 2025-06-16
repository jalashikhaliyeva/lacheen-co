import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Playfair_Display, Cormorant } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });
const cormorant = Cormorant({ subsets: ["latin"], weight: "400" });

function Hero({ heroSettings }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);
  const autoSlideRef = useRef(null);
  const videoRef = useRef(null);

  // Get current language
  const currentLanguage = i18n.language || "az";

  // Default slides fallback
  const defaultSlides = [
    {
      type: "image",
      src: "/images/products/IMG_1052.jpg",
      duration: 4500,
      content: {
        title: t("elevate_your_style"),
        button: t("discover"),
      },
    },
    {
      type: "split",
      imageSrc: "/images/IMG_8682.jpg",
      duration: 4500,
      saleContent: {
        discount: "50",
        title: t("discount"),
        description: t("discount_description"),
        // validity: t("discount_validity"),
        cta: t("shop_now"),
      },
    },
    {
      type: "video",
      src: "/images/hero/hero.mp4",
      duration: 4500,
      content: {
        title: "Experience Quality",
        subtitle: "Premium craftsmanship in every detail",
      },
    },
  ];

  // Helper function to safely get multilingual text
  const getMultilingualText = (textObj, fallback = "") => {
    if (!textObj) return fallback;

    // If it's already a string, return it
    if (typeof textObj === "string") return textObj;

    // If it's an object with language keys, get the current language
    if (typeof textObj === "object" && textObj !== null) {
      // Create a language mapping - if 'en' is selected, use 'ru' as the alternative
      let targetLanguage = currentLanguage;

      // Map 'en' to 'ru' if 'en' is not available but 'ru' is
      if (currentLanguage === "en" && !textObj["en"] && textObj["ru"]) {
        targetLanguage = "ru";
      }

      // Try current/mapped language first, then available languages, then fallback
      return (
        textObj[targetLanguage] ||
        textObj["az"] ||
        textObj["ru"] ||
        textObj["en"] ||
        Object.values(textObj)[0] ||
        fallback
      );
    }

    return fallback;
  };

  // Build slides from Firebase data or use defaults
  const slides = React.useMemo(() => {
    // Build dynamic slides array
    const dynamicSlides = [];

    // First image slide
    if (heroSettings.images && heroSettings.images[0]) {
      dynamicSlides.push({
        type: "image",
        src: heroSettings.images[0],
        duration: 4500,
        content: {
          title: t("elevate_your_style"),
          button: t("discover"),
        },
      });
    }

    // Sale slide (split layout)
    if (heroSettings.images && heroSettings.images[1]) {
      const discountQuantity = getMultilingualText(
        heroSettings.discountQuantity,
        "50"
      );
      const discountReason = getMultilingualText(
        heroSettings.discountReason,
        t("discount")
      );
      const discountDescription = getMultilingualText(
        heroSettings.discountDescription,
        t("discount_description")
      );

      dynamicSlides.push({
        type: "split",
        imageSrc: heroSettings.images[1],
        duration: 4500,
        saleContent: {
          discount: discountQuantity,
          title: discountReason,
          description: discountDescription,
          // validity: t("discount_validity"),
          cta: t("shop_now"),
        },
      });
    }

    // Video slide
    if (heroSettings.video) {
      dynamicSlides.push({
        type: "video",
        src: heroSettings.video,
        duration: 4500,
        content: {
          title: "Experience Quality",
          subtitle: "Premium craftsmanship in every detail",
        },
      });
    }

    return dynamicSlides.length > 0 ? dynamicSlides : defaultSlides;
  }, [heroSettings, currentLanguage, t]);

  // Auto-slide functionality with variable timing
  const startAutoSlide = () => {
    const currentSlideDuration = slides[currentSlide]?.duration || 4500;

    autoSlideRef.current = setTimeout(() => {
      if (currentSlide === slides.length - 1) {
        setCurrentSlide(0);
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
    }, currentSlideDuration);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearTimeout(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  useEffect(() => {
    stopAutoSlide();
    startAutoSlide();

    return () => stopAutoSlide();
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (videoRef.current) {
      // Find video slide index
      const videoSlideIndex = slides.findIndex(
        (slide) => slide.type === "video"
      );
      if (currentSlide === videoSlideIndex && videoSlideIndex !== -1) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentSlide, slides]);

  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    stopAutoSlide();
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;

    setCurrentX(clientX);
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const diff = currentX - startX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        if (currentSlide === 0) {
          setCurrentSlide(slides.length - 1);
        } else {
          setCurrentSlide((prev) => prev - 1);
        }
      } else {
        if (currentSlide === slides.length - 1) {
          setCurrentSlide(0);
        } else {
          setCurrentSlide((prev) => prev + 1);
        }
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);

    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    handleDragEnd();
  };

  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, currentX, startX]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    stopAutoSlide();
    setTimeout(() => {
      startAutoSlide();
    }, 5000);
  };

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      setCurrentSlide(slides.length);
      setTimeout(() => {
        setCurrentSlide(0);
      }, 1000);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
    stopAutoSlide();
    setTimeout(() => {
      startAutoSlide();
    }, 5000);
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      setCurrentSlide(slides.length - 1);
    } else {
      setCurrentSlide((prev) => prev - 1);
    }
    stopAutoSlide();
    setTimeout(() => {
      startAutoSlide();
    }, 5000);
  };

  return (
    <div className="w-full relative">
      <div
        ref={sliderRef}
        className="relative w-full h-[340px] md:h-[670px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ touchAction: "pan-y" }}
      >
        {/* Slides Container */}
        <div
          className={`flex w-full h-full transition-transform duration-700 ease-in-out ${
            isDragging ? "duration-0" : ""
          }`}
          style={{
            transform: `translateX(calc(-${
              currentSlide * 100
            }% + ${dragOffset}px))`,
          }}
        >
          {/* Slides */}
          {slides.map((slide, index) => {
            const isFirstSlide = index === 0;
            const isVideoSlide = slide.type === "video";
            const isSaleSlide = slide.type === "split";

            if (slide.type === "image") {
              return (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  <Image
                    src={slide.src}
                    alt="hero lacheen.co"
                    fill
                    priority={isFirstSlide}
                    loading={isFirstSlide ? "eager" : "lazy"}
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-opacity duration-700 ease-in-out" />
                  <div className="absolute inset-0 flex items-end justify-center p-4 text-center">
                    <div className="max-w-2xl text-white font-gilroy text-center transform transition-all duration-700 ease-in-out hover:scale-105">
                      <h1 className="text-2xl md:text-3xl text-center font-normal mb-2">
                        {slide.content.title}
                      </h1>
                      <button
                        onClick={() => router.push({ pathname: "/products" })}
                        className="relative text-white cursor-pointer px-8 py-3 pb-8 rounded-full group overflow-hidden"
                      >
                        <span className="relative inline-block text-lg">
                          {slide.content.button}
                          <span className="absolute left-1/2 bottom-0 h-0.25 bg-white transform -translate-x-1/2 transition-all duration-500 ease-out w-full group-hover:w-0" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Sale slide
            if (slide.type === "split") {
              return (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  <div className="flex h-full">
                    {/* Left side - Image */}
                    <div className="hidden md:flex md:w-1/2 relative">
                      <Image
                        src={slide.imageSrc}
                        alt="Sale product"
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 ease-in-out" />
                    </div>

                    {/* Right side - Sale content */}
                    <div className="w-full md:w-1/2 bg-stone-50 flex items-center justify-center p-8 relative">
                      {/* Halftone dots pattern */}
                      <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjUiIHI9IjEuNSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjIiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjUiIHI9IjEiIGZpbGw9IiMzMzMzMzMiIGZpbGwtb3BhY2l0eT0iMC4zNSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNSIgcj0iMC41IiBmaWxsPSIjMzMzMzMzIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjUiIGN5PSIxNSIgcj0iMS41IiBmaWxsPSIjMzMzMzMzIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiMzMzMzMzMiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+PGNpcmNsZSBjeD0iMzUiIGN5PSIxNSIgcj0iMSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IiMzMzMzMzMiIGZpbGwtb3BhY2l0eT0iMC4zNSIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iMjUiIHI9IjEuNSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMiIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjE1Ii8+PGNpcmNsZSBjeD0iMzUiIGN5PSIyNSIgcj0iMS41IiBmaWxsPSIjMzMzMzMzIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjUiIGN5PSIzNSIgcj0iMC41IiBmaWxsPSIjMzMzMzMzIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iMzUiIHI9IjEiIGZpbGw9IiMzMzMzMzMiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIzNSIgcj0iMS41IiBmaWxsPSIjMzMzMzMzIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iMzUiIHI9IjIiIGZpbGw9IiMzMzMzMzMiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] bg-repeat"></div>

                      <div className="text-center max-w-md transform transition-all duration-700 ease-in-out hover:scale-105 relative z-10">
                        <div className="mb-6">
                          <div
                            className={`${cormorant.className} text-6xl md:text-9xl font-light text-gray-800 leading-none`}
                          >
                            %
                            <span className="font-normal">
                              {slide.saleContent.discount}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-6">
                            {t("up_to")}
                          </div>
                        </div>

                        <div className="mb-8">
                          <div
                            className={`${cormorant.className} text-2xl md:text-5xl uppercase font-light text-gray-800 leading-none mb-4`}
                          >
                            {t("off")}
                          </div>
                          <div className="text-lg font-medium font-gilroy text-gray-700 italic mb-2">
                            {slide.saleContent.title}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-6 font-gilroy">
                          <p className="mb-1">
                            {slide.saleContent.description}
                          </p>
                          <p>{slide.saleContent.validity}</p>
                        </div>

                        <button
                          onClick={() => router.push({ pathname: "/products" })}
                          className="text-gray-800 pb-10 md:pb-0  font-normal  font-gilroy text-lg border-b-2 border-gray-800 hover:border-gray-600 transition-colors duration-300"
                        >
                          {slide.saleContent.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Video slide
            if (slide.type === "video") {
              return (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  <video
                    ref={isVideoSlide ? videoRef : null}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                    muted
                    loop
                    playsInline
                    preload="none"
                    loading="lazy"
                    quality={100}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  >
                    <source src={slide.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-700 ease-in-out" />
                  <div className="absolute inset-0 flex items-end justify-center p-4 text-center">
                    {/* Content can be added here if needed */}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ease-in-out ${
                currentSlide === index
                  ? "bg-neutral-500 scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
