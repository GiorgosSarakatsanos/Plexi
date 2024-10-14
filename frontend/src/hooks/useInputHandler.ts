import { useState } from "react"; // Add this import at the top

export const useCanvasSize = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const onSizeSelect = (
    size: string,
    unit: "mm" | "cm" | "inches" | "pixels"
  ) => {
    const [width, height] = size.split("x").map(Number);

    if (unit === "mm") {
      setCanvasSize({ width: width * 3.7795, height: height * 3.7795 });
    } else if (unit === "cm") {
      setCanvasSize({ width: width * 37.795, height: height * 37.795 });
    } else if (unit === "inches") {
      setCanvasSize({ width: width * 96, height: height * 96 });
    } else {
      setCanvasSize({ width, height });
    }
  };

  return {
    canvasSize,
    onSizeSelect,
  };
};
