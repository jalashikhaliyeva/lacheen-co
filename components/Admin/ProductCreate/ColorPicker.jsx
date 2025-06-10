import React, { useState } from "react";
import { ColorPicker } from "primereact/colorpicker";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const CustomColorPicker = ({ color, onChange }) => {
  const [internalColor, setInternalColor] = useState(color);

  const handleChange = (e) => {
    const newColor = `#${e.value}`;
    setInternalColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex items-center">
      <ColorPicker
        format="hex"
        value={internalColor.replace("#", "")}
        onChange={handleChange}
        inputId="cp-hex"
        appendTo={typeof document !== "undefined" ? document.body : "self"}
      />
      <span className="ml-2 text-sm text-gray-600">{internalColor}</span>
    </div>
  );
};

export default CustomColorPicker;
