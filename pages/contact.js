import Header from "@/components/Header";
import NavList from "@/components/NavList";
import Footer from "@/components/Footer";
import { useState } from "react";
import dynamic from "next/dynamic";
import ContactDatas from "@/components/ContactDatas";
const MapWithNoSSR = dynamic(() => import("@/components/CustomMap"), {
  ssr: false,
});

export default function Contact() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-45 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "100px" }}
      />

      <main>
        <Header />
        {/* <NavList onMenuToggle={setIsMenuOpen} /> */}

        <div className="container mx-auto px-4 py-12">
          {/* <h1 className="text-4xl font-bold mb-8 text-left">Our Locations in Baku</h1> */}
          <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
            <MapWithNoSSR />
          </div>

          <ContactDatas />


        </div>

        <Footer />
      </main>
    </div>
  );
}
