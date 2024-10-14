import { useState } from "react";

export const useBackgroundColor = () => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  return {
    backgroundColor,
    handleColorChange,
  };
};
