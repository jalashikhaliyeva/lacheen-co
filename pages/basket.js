import Header from "@/components/Header";
import NavList from "@/components/NavList";
import { useState } from "react";
import Footer from "@/components/Footer";
import BasketSectionContainer from "@/components/BasketSectionContainer";
import Container from "@/components/Container";

export default function Basket() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <main>
        <Header />
        <NavList />

        <Container>
          <BasketSectionContainer />
        </Container>

        <Footer />
      </main>
    </div>
  );
}
