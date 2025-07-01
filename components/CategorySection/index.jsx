import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Container from "../Container";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function CategorySection({ categories, categoriesSettings }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  // Get current language
  const currentLanguage = i18n.language || 'en';

  const handleCategoryClick = (categorySlug) => {
    // Handle slug which might also be an object
    const slugValue = typeof categorySlug === 'object' ? categorySlug[currentLanguage] : categorySlug;
    router.push(`/products?category=${slugValue}`);
  };

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[currentLanguage] || textObj['en'] || textObj['az'] || '';
    }
    return '';
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVideoVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVideoVisible || !videoRef.current) return;

    const video = videoRef.current;
    
    // Handle video play
    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.log("Video play failed:", err);
        setHasVideoError(true);
      }
    };

    // Handle video loading
    const handleLoaded = () => {
      playVideo().catch(console.error);
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('canplay', handleLoaded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('canplay', handleLoaded);
    };
  }, [isVideoVisible]);

  // Early return if categories is not available or empty
  if (!categories || categories.length < 2) {
    return null;
  }

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full my-4 md:my-10">
        {/* Item 1 */}
        <div 
          className="relative cursor-pointer aspect-square w-full h-[340px] md:h-[400px] lg:h-[600px] group overflow-hidden"
          onClick={() => handleCategoryClick(categories[0].slug)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent z-10" />
          <Image
            src={categoriesSettings?.images?.[0] || "/images/17.jpg"}
            alt={getLocalizedText(categories[0].name)}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out"
            quality={85}
            placeholder="blur"
            blurDataURL="/images/placeholder.jpg"
          />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
            <div className="text-center font-gilroy transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2">
              <h3 className="text-xl font-normal transition-all duration-300 group-hover:tracking-wide">
                {getLocalizedText(categories[0].name)}
              </h3>
              <p className="text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] delay-75 mt-1">
                {t("shop_now")}
              </p>
            </div>
          </div>
        </div>

        {/* Item 2 - Video */}
        <div 
          ref={videoContainerRef}
          className="relative cursor-pointer aspect-square w-full h-[340px] md:h-[400px] lg:h-[600px] group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent z-10" />
          
          {/* Fallback image if video fails to load */}
          {hasVideoError ? (
            <Image
              src="/images/video-fallback.jpg" // Add a fallback image
              alt="Video fallback"
              fill
              className="object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              preload="metadata"
              poster="/images/video-poster.jpg" // Add a poster image
            >
              <source 
                src={categoriesSettings?.video || "/images/video-lacheen.MP4"} 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
          )}
          
          <div className="absolute left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
            <div className="text-center font-gilroy transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2">
              {/* Optional: Add any text you want to display over the video */}
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div 
          className="relative cursor-pointer aspect-square w-full h-[340px] md:h-[400px] lg:h-[600px] group overflow-hidden"
          onClick={() => handleCategoryClick(categories[1].slug)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent z-10" />
          <Image
            src={categoriesSettings?.images?.[1] || "/images/16.jpg"}
            alt={getLocalizedText(categories[1].name)}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out"
            quality={85}
            placeholder="blur"
            blurDataURL="/images/placeholder.jpg"
          />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
            <div className="text-center font-gilroy transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2">
              <h3 className="text-xl font-normal transition-all duration-300 group-hover:tracking-wide">
                {getLocalizedText(categories[1].name)}
              </h3>
              <p className="text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] delay-75 mt-1">
                {t("shop_now")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CategorySection;