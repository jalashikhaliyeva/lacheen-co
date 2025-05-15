import React from "react";
import Container from "../Container";
import Image from "next/image";
import { useTranslation } from "react-i18next";

function CategorySection() {
  const { t } = useTranslation();
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full my-4 md:my-10">
        {/* Item 1 */}
        <div className="relative cursor-pointer aspect-square w-full h-[300px] md:h-[400px] lg:h-[600px] group overflow-hidden ">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent z-10" />
          <Image
            src={"/images/17.jpg"}
            alt="category lacheen.co"
            fill
            priority
            className="object-cover transition-transform duration-500 ease-out "
            quality={100}
          />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
            <div className="text-center font-gilroy  transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2">
              <h3 className="text-xl font-normal transition-all duration-300 group-hover:tracking-wide">
                Sandals
              </h3>
              <p className="text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] delay-75 mt-1">
                {t("shop_now")}
              </p>
            </div>
          </div>
        </div>

        {/* Item 2 - Video */}
        <div className="relative cursor-pointer aspect-square w-full h-[300px] md:h-[400px] lg:h-[600px] group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/images/video-lacheen.MP4" type="video/mp4" />
          </video>
          <div className="absolute  left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
            <div className="text-center font-gilroy transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2">
              {/* <h3 className="text-3xl font-normal transition-all duration-300 group-hover:tracking-wide">
                Lacheen Shoes - Symbol of Excellence
              </h3> */}
              {/* <p className="text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] delay-75 mt-1">
                Shop Now
              </p> */}
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="relative cursor-pointer aspect-square w-full h-[300px] md:h-[400px] lg:h-[600px] group overflow-hidden ">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent z-10" />
          <Image
            src={"/images/16.jpg"}
            alt="category lacheen.co"
            fill
            priority
            className="object-cover transition-transform duration-500 ease-out "
            quality={100}
          />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
            <div className="text-center font-gilroy transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2">
              <h3 className="text-xl font-normal transition-all duration-300 group-hover:tracking-wide">
                Flats
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
