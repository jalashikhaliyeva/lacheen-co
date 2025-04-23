import React from "react";
import Container from "../Container";
import Image from "next/image";

const Footer = () => {
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
    <div className="flex flex-col gap-4">
      {/* Top section: stacks on mobile, row on md+ */}
      <div className="border-t border-b py-10">
        <Container>
          <div className="flex flex-col md:flex-row justify-between gap-8 w-full">
            {/* Help */}
            <div className="flex flex-col gap-4 font-gilroy w-full md:w-1/3">
              <h6 className="text-base pb-5 uppercase font-normal text-neutral-500">
                Help
              </h6>
              <p className="text-sm">
                You can write to us via WhatsApp or call us at the number below.
              </p>
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
              <p className="text-sm">Follow us on Instagram</p>
            </div>

            {/* Stores */}
            <div className="flex flex-col gap-4 font-gilroy w-full md:w-1/3">
              <h6 className="text-base pb-5 uppercase font-normal text-neutral-500">
                Stores
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

            {/* Email Sign‑up */}
            <div className="flex flex-col gap-4 font-gilroy w-full md:w-1/3">
              <h6 className="text-base pb-5 uppercase font-normal text-neutral-500">
                Email Sign‑up
              </h6>
              <p className="text-sm">
                Sign up for Lacheen emails and receive the latest news from us.
              </p>
              <button
                onClick={handleEmailClick}
                className="text-sm hover-effect w-fit"
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
          <p className="text-sm">Sitemap</p>
          <p className="text-sm">All rights reserved</p>
          <p className="text-sm">Terms of Use</p>
          <p className="text-sm">Privacy Policy</p>
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
