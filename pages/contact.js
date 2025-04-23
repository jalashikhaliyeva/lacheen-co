import Header from "@/components/Header";
import NavList from "@/components/NavList";
import Footer from "@/components/Footer";
import { useState } from "react";
import dynamic from "next/dynamic";
import ContactDatas from "@/components/ContactDatas";

// Dynamically import the Map component to avoid SSR issues with Leaflet
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

          {/* <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Koroğlu Parkı</h2>
              <p className="text-gray-700">Anvar Gasimzadeh 56c, Nasimi ray. Ganclik</p>
              <p className="text-gray-700">Baku 1122, Azerbaijan</p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Michael Refili St</h2>
              <p className="text-gray-700">9RMW+87Q, Michael Refili St</p>
              <p className="text-gray-700">Baku, Azerbaijan</p>
            </div>
          </div> */}
        </div>

        <Footer />
      </main>
    </div>
  );
}
