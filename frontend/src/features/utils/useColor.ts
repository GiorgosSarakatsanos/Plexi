import { useState } from "react";

export const useColor = (initialColor: string = "#ffffff") => {
  const [color, setColor] = useState(initialColor);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  return {
    color,
    handleColorChange,
  };
};
