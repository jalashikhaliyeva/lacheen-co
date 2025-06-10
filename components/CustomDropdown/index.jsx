// src/components/CustomDropdown.jsx
import React, { useRef, useEffect, useState } from "react";

const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = selected ? (
    <span className="flex items-center">
      <span
        className="inline-block w-4 h-4 rounded-full mr-2 border"
        style={{ backgroundColor: selected.code }}
      />
      {selected.name}
    </span>
  ) : (
    placeholder
  );

  return (
    <div className="relative w-full font-gilroy" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex py-3 px-4 items-center border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200"
      >
        {displayValue}
      </button>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-gray-100 border border-gray-400 rounded-lg shadow-md z-10 max-h-60 overflow-y-auto">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-200 rounded-lg cursor-pointer flex items-center"
            >
              <span
                className="inline-block w-4 h-4 rounded-full mr-2 border"
                style={{ backgroundColor: opt.code }}
              />
              <span>{opt.name}</span>
              {selected &&
              selected.code === opt.code &&
              selected.name === opt.name ? (
                <span className="ml-auto">✓</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
