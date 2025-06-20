import React from "react";
import { Playfair_Display, Cormorant } from "next/font/google";
import Container from "../Container";
import { useTranslation } from "react-i18next";

const playfair = Playfair_Display({ subsets: ["latin"] });
const cormorant = Cormorant({ subsets: ["latin"], weight: "400" });

function Citate() {
  const { t } = useTranslation();
  return (
    <Container>
      <div className="bg-neutral-100 text-neutral-800 p-9 h-[300px] flex flex-col gap-4 items-center justify-center relative">
        <span
          className={`${playfair.className} absolute left-12 top-16 text-9xl opacity-20`}
          style={{ transform: "translateY(-50%)" }}
        >
          "
        </span>
        <h1
          className={`${playfair.className} text-xl md:text-4xl text-center max-w-2xl z-10`}
        >
          Where every step feels like a whispered secret.
        </h1>
        <span
          className={`${playfair.className} absolute right-12 bottom-16 text-9xl opacity-20`}
          style={{ transform: "translateY(50%)" }}
        >
          "
        </span>

        <p
          class={`${cormorant.className} uppercase text-base md:text-2xl mt-2`}
        >
          Lacheen
        </p>
      </div>
    </Container>
  );
}

export default Citate;
