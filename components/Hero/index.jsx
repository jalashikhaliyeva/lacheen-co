import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="w-full relative">
      <div className="relative w-full h-[340px]  md:h-[670px]">
        <Image
          src={"/images/products/IMG_1052.jpg"}
          alt="hero lacheen.co"
          fill
          priority
          className="object-cover"
        />

        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" /> */}
        <div className="absolute inset-0 bg-black/30" />
        {/* <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" /> */}

        <div className="absolute inset-0 flex items-end justify-center p-4 text-center">
          <div className="max-w-2xl text-white font-gilroy text-center">
            <h1 className="text-2xl md:text-3xl text-center font-normal mb-2">
              {t("elevate_your_style")}
            </h1>
            {/* <p className="text-base mb-8">Elevate your style with our premium products</p> */}
            <button
              onClick={() =>
                router.push({
                  pathname: "/products",
                })
              }
              className="relative text-white cursor-pointer px-8 py-3 rounded-full group overflow-hidden"
            >
              <span className="relative inline-block text-lg">
                {t("discover")}
                <span
                  className="
        absolute left-1/2 bottom-0
        h-0.25 bg-white
        transform -translate-x-1/2
        transition-all duration-500 ease-out
        w-full group-hover:w-0
      "
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
