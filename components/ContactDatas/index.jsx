import React, { useState } from "react";
import { PiPhoneCallThin } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import Container from "../Container";
import { useFAQItems } from "@/shared/mock/faqItems";
import { useTranslation } from "react-i18next";

function ContactDatas() {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqItems = useFAQItems();
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const { t } = useTranslation();


  return (
    <>
      <Container>
        <div className="flex flex-col lg:flex-row justify-between lg:gap-20 gap-12 items-start lg:divide-x font-gilroy mt-16">
          <div className="flex flex-col gap-10 lg:w-1/2 w-full">
            <div className="flex flex-col gap-4">
              <h1 className="font-normal uppercase text-xl md:text-2xl text-neutral-800">
                {t("call_us")}
              </h1>
              <p className="text-neutral-800 text-sm max-w-[450px]">
                {t("experience_our_latest_shoe_collections_in_person_at_our_comfortable_retail_stores")}
              </p>

              <div className="flex items-center gap-2">
                <div className="rounded-full w-10 h-10 flex items-center justify-center">
                  <PiPhoneCallThin className="text-3xl text-pink-900" />
                </div>
                <p className="text-base text-pink-800">+994 51 777 72 85</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="font-normal uppercase text-xl md:text-2xl text-neutral-800">
                {t("visit_us")}
              </h1>
              <p className="text-neutral-500 text-sm max-w-[450px]">
                {t("have_questions_about_our_shoe_collection_or_need_style_advice")}
              </p>

              <div className="flex items-center gap-2">
                <div className="rounded-full w-10 h-10 flex items-center justify-center">
                  <CiLocationOn className="text-2xl text-pink-800" />
                </div>
                <p className="text-base max-w-[350px] text-pink-800">
                  Koroğlu Parkı, Anvar Gasimzadeh 56c, Nasimi ray. Ganclik, Baku
                  1122
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full w-10 h-10 flex items-center justify-center">
                  <CiLocationOn className="text-2xl text-pink-800" />
                </div>
                <p className="text-base text-pink-800">
                  9RMW+87Q, Michael Refili St, Baku
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full lg:pl-8">
            <h1 className="font-normal uppercase text-xl md:text-2xl mb-6 text-neutral-800">
              {t("frequently_asked_questions")}
            </h1>
            <div className="space-y-0">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`pb-4 ${
                    index !== faqItems.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <button
                    className="flex justify-between items-center w-full py-4 text-left"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-normal text-gray-800 text-left pr-4">
                      {item.question}
                    </span>
                    {activeIndex === index ? (
                      <AiOutlineMinus className="text-gray-500 flex-shrink-0" />
                    ) : (
                      <AiOutlinePlus className="text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeIndex === index
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-gray-600 pb-2">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default ContactDatas;
