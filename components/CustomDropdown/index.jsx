
import React, { useRef, useEffect, useContext, useState } from "react";
const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  onAddNew,
  addNewLabel,
  placeholder,
  multiSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    // For single-select mode, simply update the selection
    if (!multiSelect) {
      onSelect(option);
      setIsOpen(false);
      return;
    }

    // Multi-select logic remains unchanged:
    if (option === "select-all") {
      if (selected.length === options.length && options.length > 0) {
        onSelect([]);
      } else {
        onSelect([...options]);
      }
    } else {
      if (selected.includes(option)) {
        onSelect(selected.filter((item) => item !== option));
      } else {
        onSelect([...selected, option]);
      }
    }
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    const trimmed = newOption.trim();
    const exists = options.some(
      (option) => option.toLowerCase() === trimmed.toLowerCase()
    );
    if (trimmed !== "" && !exists) {
      onAddNew(trimmed);
      if (multiSelect) {
        onSelect([...selected, trimmed]);
      } else {
        onSelect(trimmed);
      }
      setNewOption("");
      setIsAdding(false);
      if (!multiSelect) {
        setIsOpen(false);
      }
    } else if (exists) {
      toast.warning("This value already exists!");
    }
  };

  const displayValue =
    multiSelect && selected.length > 0
      ? selected.join(", ")
      : !multiSelect && selected
      ? selected
      : placeholder;

  return (
    <div className="relative w-full font-gilroy" ref={dropdownRef}>
      <label className="text-xl text-gray-500 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex py-3 px-4 items-center border border-gray-400 rounded-lg w-full bg-gray-100 hover:bg-gray-200"
      >
        {displayValue}
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-gray-100 border border-gray-400 rounded-lg shadow-md z-10">
          {isAdding ? (
            <form onSubmit={handleAddNew}>
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsAdding(false);
                  }
                }}
                placeholder="Enter new value"
                className="w-full px-3 py-2 border-b focus:outline-none"
                autoFocus
              />
            </form>
          ) : (
            <ul>
              <li
                onClick={() => setIsAdding(true)}
                className="px-3 py-2 hover:bg-gray-200 rounded-lg  cursor-pointer transition-colors"
              >
                {addNewLabel}
              </li>
              {/* Render “Select All” only if multiSelect is enabled */}
              {multiSelect && (
                <li
                  onClick={() => handleSelect("select-all")}
                  className="px-3 py-2 hover:bg-gray-200 rounded-lg  cursor-pointer flex justify-between items-center"
                >
                  <span>Select All</span>
                  {selected.length === options.length && options.length > 0 && (
                    <span>✓</span>
                  )}
                </li>
              )}
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="px-3 py-2 hover:bg-gray-200 rounded-lg  cursor-pointer flex justify-between items-center"
                >
                  <span>{option}</span>
                  {(!multiSelect && selected === option) ||
                  (multiSelect && selected.includes(option)) ? (
                    <span>✓</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;