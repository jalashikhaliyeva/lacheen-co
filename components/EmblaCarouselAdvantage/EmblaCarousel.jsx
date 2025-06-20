import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import Image from "next/image";
import styles from "./embla.module.css";
import Container from "../Container";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const SliderEmbla = ({ products }) => {

  // console.log(products, "products");
  
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [showDots, setShowDots] = useState(products?.length > 3);

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

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect(); // initial state
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => {
      emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0);
    }, 3500);
    return () => clearInterval(id);
  }, [emblaApi]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 text-neutral-700 md:mt-10 ${styles.embla}`}>
      <Container>
        <div className="flex justify-between w-full">
          <h1 className="pb-3 font-gilroy text-xl md:text-2xl">
            {t("must_haves")}
          </h1>
          <div className="flex items-center  gap-3">
            {prevBtnEnabled && (
              <BsArrowLeft
                onClick={scrollPrev}
                className="cursor-pointer text-lg md:text-2xl text-neutral-500"
              />
            )}

            {nextBtnEnabled && (
              <BsArrowRight
                onClick={scrollNext}
                className="cursor-pointer text-lg md:text-2xl text-neutral-500"
              />
            )}
          </div>
        </div>
      </Container>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={`${styles.embla__container} flex`}>
          {products.map((product) => (
            <div
              key={product.id}
              className={`${styles.embla__slide} lg:flex-[0_0_35%] px-2`}
            >
               <Link href={`/products/${product.id}`}>
              <div className="group flex flex-col w-full bg-white rounded-lg transition-transform duration-300 cursor-pointer">
                <Image
                  src={
                    product.image_url || 
                    (product.images?.[0]?.url || product.images?.[0]) || 
                    '/images/placeholder.jpg'
                  }
                  width={370}
                  height={300}
                  alt={product.name}
                  className="object-cover w-full"
                  quality={100}
                />
              </div>

              <p className="uppercase pt-3 font-poppins text-xs md:text-lg">
                {product.name}
              </p>
            </Link></div>
          ))}
        </div>
      </div>

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
