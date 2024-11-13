// useZoom.ts
import { useState, useEffect } from "react";

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4.0;

export const useZoom = () => {
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level (100%)

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const setZoomToPercentage = (percentage: number) => {
    const newZoom = percentage / 100;
    setZoomLevel(Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM));
  };

  useEffect(() => {
    console.log("Current Zoom Level:", zoomLevel); // Log the zoom level whenever it changes
  }, [zoomLevel]);

  return {
    zoomLevel,
    zoomIn,
    zoomOut,
    setZoomToPercentage,
  };
};
