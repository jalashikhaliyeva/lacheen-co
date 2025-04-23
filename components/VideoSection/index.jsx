import React from "react";

function VideoSection() {
  return (
    <>
     
      <div className="relative aspect-square w-full h-[640px] group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/30 to-transparent z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/uhd_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute  left-0 right-0 flex flex-col items-center justify-end pb-6 z-20 text-white h-[40%]">
          <div className="text-center font-gilroy transform transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-2"></div>
        </div>
      </div>
    </>
  );
}

export default VideoSection;
