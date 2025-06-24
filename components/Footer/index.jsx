import React from "react";
import Container from "../Container";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CiInstagram, CiMail } from "react-icons/ci";

const Footer = () => {
  const { t } = useTranslation();
  const handlePhoneClick = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmailClick = () => {
    window.open(
      "mailto:lacheenco@gmail.com?subject=Salam Lacheen.co komandasi"
    );
  };

  const handleAddressClick = (address) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`
    );
  };

  return (
    <div className="flex flex-col gap-4 text-neutral-800">
      <div className="border-t border-b py-10">
        <Container>
          <div className="flex flex-col md:flex-row justify-between gap-8 w-full">
            <div className="flex flex-col gap-4 font-gilroy w-full md:w-1/3">
              <h6 className="text-base pb-5 uppercase font-normal text-neutral-500">
                {t("help")}
              </h6>
              <p className="text-sm">{t("contact_text")}</p>
              <button
                onClick={() => handlePhoneClick("+994517777285")}
                className="text-sm hover-effect w-fit"
              >
                +994 51 777 72 85
              </button>
              <button
                onClick={() => handlePhoneClick("+994517777285")}
                className="text-sm hover-effect w-fit"
              >
                +994 51 777 72 85
              </button>
              <div
                className="text-sm flex  flex-row text-neutral-800 gap-2 items-center cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/lacheen.co?igsh=MWgzbnp4am56NHhnYg==",
                    "_blank"
                  )
                }
              >
                <CiInstagram className="text-2xl" />
                {t("follow_us")}
              </div>
            </div>

            <div className="flex flex-col gap-4 font-gilroy w-full md:w-1/3">
              <h6 className="text-base pb-5 uppercase font-normal text-neutral-500">
                {t("stores")}
              </h6>
              <button
                onClick={() =>
                  handleAddressClick(
                    "Koroğlu Parkı, Anvar Gasimzadeh 56c, Nasimi ray. Ganclik, Baku 1122"
                  )
                }
                className="text-sm hover-effect text-left w-fit"
              >
                Koroğlu Parkı, Anvar Gasimzadeh 56c, Nasimi ray. Ganclik, Baku
                1122
              </button>
              <button
                onClick={() =>
                  handleAddressClick("9RMW+87Q, Michael Refili St, Baku")
                }
                className="text-sm hover-effect text-left w-fit"
              >
                9RMW+87Q, Michael Refili St, Baku
              </button>
            </div>

            <div
              onClick={handleEmailClick}
              className="flex flex-col gap-4 font-gilroy w-full md:w-1/3"
            >
              <h6 className="text-base pb-5 uppercase font-normal text-neutral-500">
                {t("email_signup")}
              </h6>
              <p className="text-sm">{t("newsletter_text")}</p>
              <button
                onClick={handleEmailClick}
                className="text-sm items-center gap-1 hover-effect w-fit cursor-pointer"
              >
                lacheenco@gmail.com
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom section */}
      <div className="pt-8 w-full font-gilroy">
        {/* links: wrap on small, horizontal on sm+ */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-5">
          <p className="text-sm"> {t("sitemap")}</p>
          <p className="text-sm"> {t("all_rights_reserved")}</p>
          <p className="text-sm">{t("terms_of_use")}</p>
          <p className="text-sm">{t("privacy_policy")}</p>
        </div>
         {/* logo centered */}
        <div className="flex justify-center py-10">
          <Image
            src={"/images/logo/lacheen-logo.png"}
            width={300}
            height={200}
            alt="logo lacheen"
            className="w-[180px] object-cover"
            quality={100}
          />
        </div>
      </div>

      <style jsx>{`
        .hover-effect {
          position: relative;
          display: inline-block;
        }
        .hover-effect::after {
          content: "";
          position: absolute;
          width: 0;
          height: 1px;
          bottom: 0;
          left: 0;
          background-color: currentColor;
          transition: width 0.3s ease;
        }
        .hover-effect:hover::after {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Footer;
