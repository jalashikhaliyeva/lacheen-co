import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import Image from "next/image";
import styles from "./embla.module.css";
import Container from "../Container";

// 🔒 100 % STATIC CONTENT ---------------------------------------------
const slides = [
  {
    id: 1,
    name: "Summer Elegance",
    image: "/images/12.jpg",
  },
  {
    id: 2,
    name: "Autumn Chic",
    image: "/images/products/IMG_1154.jpg",
  },
  {
    id: 3,
    name: "Winter Luxe",
    image: "/images/15.jpg",
  },
  {
    id: 4,
    name: "Spring Blooms",
    image: "/images/products/IMG_1148.jpg",
  },
  {
    id: 5,
    name: "Casual Glam",
    image: "/images/IMG_7794.jpg",
  },
  {
    id: 6,
    name: "Evening Sparkle",
    image: "/images/IMG_7803.jpg",
  },
  {
    id: 7,
    name: "Street Style",
    image: "/images/IMG_2929.jpg",
  },
  {
    id: 8, // Fixed duplicate ID (was 7 before)
    name: "Minimalist Beauty",
    image: "/images/IMG_7769.jpg",
  },
];
// ---------------------------------------------------------------------

const SliderEmbla = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [showDots, setShowDots] = useState(slides.length > 3);

  // ----------------- Helpers -----------------
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // --------------- Init listeners ---------------
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect(); // initial state
  }, [emblaApi, onSelect]);

  // --------------- Auto‑play --------------------
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => {
      emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0);
    }, 3500);
    return () => clearInterval(id);
  }, [emblaApi]);

  // =============== RENDER =======================
  return (
    <div className={`mt-4 md:mt-10 ${styles.embla}`}>
      <Container>
        <h1 className="pb-3 font-gilroy text-xl md:text-2xl">Must-Haves</h1>
      </Container>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={`${styles.embla__container} flex`}>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`${styles.embla__slide} lg:flex-[0_0_35%] px-2`}
            >
              <div className="group flex flex-col w-full bg-white rounded-lg transition-transform duration-300 cursor-pointer">
                {/* <p className="text-mainColorDark pt-4 font-oswald font-bold text-center text-lg pb-4">
                  {slide.name}
                </p> */}

                <Image
                  src={slide.image}
                  width={370}
                  height={300}
                  alt={slide.name}
                  className="object-cover w-full"
                  quality={100}
                />
              </div>

              <p className="uppercase pt-3 font-poppins text-xs  md:text-lg">
                {slide.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {prevBtnEnabled && (
        <button
          className={`${styles.embla__button} ${styles["embla__button--prev"]}`}
          onClick={scrollPrev}
          aria-label="Previous Slide"
        >
          <GrFormPrevious className="text-lg" />
        </button>
      )}

      {nextBtnEnabled && (
        <button
          className={`${styles.embla__button} ${styles["embla__button--next"]}`}
          onClick={scrollNext}
          aria-label="Next Slide"
        >
          <MdNavigateNext className="text-lg" />
        </button>
      )}

      {/* Optional dots indicator */}
      {showDots && (
        <div className={styles.embla__dots}>
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`${styles.embla__dot} ${
                selectedIndex === idx ? styles["is-selected"] : ""
              }`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderEmbla;
