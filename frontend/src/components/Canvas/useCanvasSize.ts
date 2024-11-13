// useCanvasSize.ts
import { useState } from "react";
import { getCanvasDimensions } from "./CanvasDimensions";
import { sizeMap, UnitType } from "../SizeSelection/SizeMap";

export const useCanvasSize = () => {
  const defaultImageSize = sizeMap.imageSize.predefined[0];

  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
    zoomLevel: number;
  }>({
    width: defaultImageSize.width,
    height: defaultImageSize.height,
    zoomLevel: 1,
  });

  const onSizeSelect = (width: number, height: number, unit: UnitType) => {
    const { widthInPixels, heightInPixels, zoomLevel } = getCanvasDimensions(
      width,
      height,
      unit
    );
    setCanvasSize({ width: widthInPixels, height: heightInPixels, zoomLevel });
  };

  return { canvasSize, onSizeSelect };
};
