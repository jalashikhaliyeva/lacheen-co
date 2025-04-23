import React, { useState, useRef, useEffect } from "react";
import Container from "../Container";

function NavList({ onMenuToggle }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [displayedMenu, setDisplayedMenu] = useState(null);
  const [contentVisible, setContentVisible] = useState(true);

  const timeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);
  const menuItems = [
    { id: "new", label: "New" },
    { id: "special", label: "Special Prices", isHighlighted: true },
    { id: "viewAll", label: "View all" },
    { id: "sandals", label: "Sandals" },
    { id: "sneakers", label: "Sneakers" },
    { id: "flats", label: "Flats" },
  ];

  const subMenuData = {
    new: {
      mainImage: "/images/16.jpg",
      description:
        "Discover our latest collection of trendy footwear for the season.",
      items: [
        "Spring Collection",
        "Summer Styles",
        "Limited Edition",
        "Collaborations",
      ],
      images: [
        "/images/12.jpg",
        "/images/14.jpg",
        "/images/15.jpg",
        "/images/13.jpg",
      ],
    },
    special: {
      mainImage: "/images/products/IMG_0998 2.jpg",
      description: "Don't miss out on these amazing deals and discounts!",
      items: ["Clearance", "Last Season", "Buy 1 Get 1", "Seasonal Offers"],
      images: [
        "/images/products/IMG_1137.jpg",
        "/images/products/IMG_1154.jpg",
        "/images/products/IMG_1151.jpg",
        "/images/products/IMG_1146.jpg",
      ],
    },
    viewAll: {
      mainImage: "/images/products/IMG_1598 2.jpg",
      description: "Browse our complete collection of footwear.",
      items: ["All Shoes", "All Sandals", "All Boots", "All Accessories"],
      images: [
        "/images/products/IMG_1137.jpg",
        "/images/products/IMG_1154.jpg",
        "/images/products/IMG_1151.jpg",
        "/images/products/IMG_1146.jpg",
      ],
    },
    sandals: {
      mainImage: "/images/products/IMG_1052.jpg",
      description: "Comfortable and stylish sandals for every occasion.",
      items: ["Casual Sandals", "Dress Sandals", "Sport Sandals", "Beachwear"],
      images: [
        "/images/products/IMG_1137.jpg",
        "/images/products/IMG_1154.jpg",
        "/images/products/IMG_1151.jpg",
        "/images/products/IMG_1146.jpg",
      ],
    },
    sneakers: {
      mainImage: "/images/17.jpg",
      description: "Trendy sneakers for your active lifestyle.",
      items: ["Running", "Casual", "Basketball", "Limited Edition"],
      images: [
        "/images/products/IMG_1137.jpg",
        "/images/products/IMG_1154.jpg",
        "/images/products/IMG_1151.jpg",
        "/images/products/IMG_1146.jpg",
      ],
    },
    flats: {
      mainImage: "/images/products/IMG_1052.jpg",
      description: "Elegant and comfortable flats for everyday wear.",
      items: ["Ballet Flats", "Loafers", "Pointed Toe", "Comfort Plus"],
      images: [
        "/images/products/IMG_1137.jpg",
        "/images/products/IMG_1154.jpg",
        "/images/products/IMG_1151.jpg",
        "/images/products/IMG_1146.jpg",
      ],
    },
  };

  const handleMenuEnter = (menuId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setActiveMenu(menuId);
    onMenuToggle(true);

    if (!isMenuMounted) {
      setIsMenuMounted(true);
      // Start the opening animation
      setTimeout(() => {
        setIsMenuVisible(true);
        setDisplayedMenu(menuId);
        setContentVisible(true);
      }, 10); // Small delay to allow mounting before animation
    } else if (menuId !== displayedMenu) {
      setContentVisible(false);
      if (contentTimeoutRef.current) {
        clearTimeout(contentTimeoutRef.current);
      }
      contentTimeoutRef.current = setTimeout(() => {
        setDisplayedMenu(menuId);
        setContentVisible(true);
      }, 200); // Reduced from 260ms for faster content transition
    } else {
      // If same menu is re-entered, just ensure it's visible
      setIsMenuVisible(true);
    }
  };

  const handleMenuLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Start the closing animation
    setIsMenuVisible(false);
    // Delay the unmounting to allow the animation to complete
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setIsMenuMounted(false);
      onMenuToggle(false);
    }, 300); // Matches the exit animation duration
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (contentTimeoutRef.current) clearTimeout(contentTimeoutRef.current);
    };
  }, []);

  return (
    <div className="hidden md:block bg-white relative z-50" onMouseLeave={handleMenuLeave}>
      <Container>
        <div className="flex overflow-hidden gap-7 justify-center items-center pb-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="relative group"
              onMouseEnter={() => handleMenuEnter(item.id)}
            >
              <p
                className={`font-gilroy font-[400] text-xs  md:text-base uppercase cursor-pointer transition-all duration-200 ${
                  item.isHighlighted ? "text-pink-800" : ""
                } ${
                  activeMenu === item.id
                    ? "border-b-2 border-black pb-1"
                    : "hover:border-b hover:border-gray-300 pb-1"
                }`}
              >
                {item.label}
              </p>
              {activeMenu === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black transform origin-left scale-x-100 transition-transform duration-300"></div>
              )}
            </div>
          ))}
        </div>
      </Container>

      {/* Mega Menu Dropdown */}
      {isMenuMounted && (
        <div
          className={`absolute left-0 right-0 bg-white shadow-lg z-50
                    overflow-hidden will-change-[opacity,transform,max-height]
                    ${
                      isMenuVisible
                        ? "animate-slide-down-soft"
                        : "animate-slide-up-soft"
                    }`}
          // style={{
          //   boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          //   willChange: "opacity, transform",
          // }}
        >
          <Container>
            <div className="flex justify-center h-full p-6">
              {/* Main Image */}
              <div
                className={`w-[360px] h-[400px] pr-6 transition-opacity duration-300 ${
                  contentVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-full h-full bg-gray-100 overflow-hidden rounded-lg">
                  <img
                    src={subMenuData[displayedMenu]?.mainImage}
                    alt="Main banner"
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                  />
                </div>
              </div>

              {/* Content Column */}
              <div
                className={`w-1/3 pr-6 transition-opacity duration-300 ${
                  contentVisible ? "opacity-100 ease-out" : "opacity-0 ease-in"
                }`}
              >
                <h3 className="font-gilroy font-bold text-2xl mb-4">
                  {menuItems.find((item) => item.id === displayedMenu)?.label}
                </h3>
                <p className="font-gilroy text-gray-700 mb-6">
                  {subMenuData[displayedMenu]?.description}
                </p>
                <ul className="space-y-3">
                  {subMenuData[displayedMenu]?.items.map((itm, idx) => (
                    <li
                      key={idx}
                      className="font-gilroy text-lg hover:text-pink-800 cursor-pointer transition-colors duration-200"
                    >
                      {itm}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`transition-opacity duration-300 ${
                  contentVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <h4 className="font-gilroy font-bold text-lg mb-4">
                  Featured Items
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {subMenuData[displayedMenu]?.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="aspect-square w-[160px] h-[180px] overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:shadow-md"
                    >
                      <img
                        src={image}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

export default NavList;
