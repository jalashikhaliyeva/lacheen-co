import Image from "next/image";
import React from "react";
import Container from "../Container";
import { Playfair_Display, Cormorant } from "next/font/google";
const playfair = Playfair_Display({ subsets: ["latin"] });
const cormorant = Cormorant({ subsets: ["latin"], weight: "400" });

function VideoandImage({ attitudeSettings }) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8 items-start">
      {/* Image Container */}
      <Container className="w-full md:w-auto">
        <div className="flex flex-col md:flex-row justify-center items-start md:ml-[200px]">
          <h2
            className={`${playfair.className} text-xs mb-2 md:mb-0 md:mr-2 font-normal text-neutral-500 transition-all duration-300 group-hover:tracking-wide`}
          >
            Not just shoes.<br /> A Lacheen attitude.
          </h2>
          <div className="relative aspect-square w-full h-[300px] sm:h-[400px] md:h-[440px] group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-600/70 via-neutral-900/30 to-transparent z-10" />
            <Image
              src={attitudeSettings?.image || "/images/IMG_8682.jpg"} // Use from settings or fallback
              alt="category lacheen.co"
              fill
              priority
              className="object-cover transition-transform duration-500 ease-out"
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </Container>

      {/* Video Container */}
      <div className="relative aspect-square w-full h-[300px] sm:h-[500px] md:h-[640px] group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/30 to-transparent z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src={attitudeSettings?.video || "/images/video2-lacheen.MP4"} // Use from settings or fallback
            type="video/mp4" 
          />
        </video>
        <div className="absolute left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
          <div className="text-center font-gilroy transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2"></div>
        </div>
      </div>
    </div>
  );
}

export default VideoandImage;