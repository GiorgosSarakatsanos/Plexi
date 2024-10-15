import { useState } from "react";
import { getCanvasDimensions } from "../components/Canvas/CanvasDimensions";
import { sizeMap } from "../data/SizeMap"; // Import sizeMap

export const useCanvasSize = () => {
  // Extract the default image size from sizeMap
  const defaultImageSize = sizeMap.imageSize.predefined[0]; // "1800 x 768 pixels"
  const sizeMatch = defaultImageSize.match(/(\d+)\s*x\s*(\d+)/);
  const defaultWidth = sizeMatch ? parseInt(sizeMatch[1], 10) : 1000;
  const defaultHeight = sizeMatch ? parseInt(sizeMatch[2], 10) : 1000;

  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({
    width: defaultWidth,
    height: defaultHeight,
  });

  const onSizeSelect = (width: number, height: number, unit: string) => {
    const { widthInPixels, heightInPixels } = getCanvasDimensions(
      width,
      height,
      unit
    );
    setCanvasSize({ width: widthInPixels, height: heightInPixels });
  };

  return { canvasSize, onSizeSelect };
};
