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
      <div />

      <main>
        <Header />
        <NavList />

        <div className="container mx-auto px-4 py-12">
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
