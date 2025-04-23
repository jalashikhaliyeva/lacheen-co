import React, { useState } from "react";
import { FiPhone } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import Container from "../Container";
import { PiPhoneCallThin } from "react-icons/pi";
import {
  AiOutlineWhatsApp,
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

function ContactDatas() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What are your business hours?",
      answer:
        "Our business hours are from 9:00 AM to 6:00 PM, Monday through Friday. We are closed on weekends and public holidays.",
    },
    {
      question: "How can I schedule an appointment?",
      answer:
        "You can schedule an appointment by calling us at +994 51 777 72 85 or by visiting our location during business hours.",
    },
    {
      question: "Do you offer emergency services?",
      answer:
        "Yes, we offer emergency services outside of normal business hours. Please call our emergency line at +994 51 777 72 86 for immediate assistance.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash, credit cards (Visa, MasterCard), and mobile payment options. Payment is due at the time of service.",
    },
    {
      question: "Is there parking available at your location?",
      answer:
        "Yes, we have dedicated parking spaces for our customers at both of our locations. Parking is free for the duration of your visit.",
    },
  ];

  return (
    <>
      <Container>
        <div className="flex justify-between gap-20 items-start divide-x  font-gilroy mt-16 ">
          <div className="flex flex-col gap-10 w-1/2">
            <div className="flex flex-col gap-4">
              <h1 className="font-normal uppercase text-2xl">Call us</h1>
              <p className="text-neutral-500 text-sm max-w-[450px]">
                Have questions about our shoe collection or need style advice?
                Our friendly customer service team is ready to assist you with
                any inquiries about sizes, styles, or special orders.
              </p>

              <div className="flex items-center gap-2">
                <div className="rounded-full w-10 h-10  flex items-center justify-center">
                  <PiPhoneCallThin className="text-3xl text-pink-900" />
                </div>
                <p className="text-base text-pink-800">+994 51 777 72 85</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="font-normal uppercase text-2xl">Visit us</h1>
              <p className="text-neutral-500 text-sm  max-w-[450px]">
                Experience our latest shoe collections in person at our
                comfortable retail stores. Our knowledgeable staff will help you
                find the perfect fit and style for any occasion.
              </p>

              <div className="flex items-center gap-2">
                <div className="rounded-full w-10 h-10  flex items-center justify-center">
                  <CiLocationOn className="text-2xl text-pink-800" />
                </div>
                <p className="text-base max-w-[350px] text-pink-800">
                  Koroğlu Parkı, Anvar Gasimzadeh 56c, Nasimi ray. Ganclik, Baku
                  1122
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full w-10 h-10  flex items-center justify-center">
                  <CiLocationOn className="text-2xl text-pink-800" />
                </div>
                <p className="text-base text-pink-800">
                  9RMW+87Q, Michael Refili St, Baku
                </p>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <h1 className="font-normal uppercase text-2xl mb-6">
              Frequently Asked Questions
            </h1>
            <div className="space-y-0">
              {" "}
              {/* Removed container border */}
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
