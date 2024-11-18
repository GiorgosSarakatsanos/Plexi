import Konva from "konva";
import { calculatePointerPosition } from "../Shape/calculatePointerPosition"; // Adjust path as needed

export const zoomStage = (
  stage: Konva.Stage,
  scaleBy: number,
  isZoomIn: boolean,
  options?: { pointerPosition?: { x: number; y: number } }
) => {
  const oldScale = stage.scaleX();
  const newScale = isZoomIn
    ? Math.min(oldScale * scaleBy, 250) // Limit max scale
    : Math.max(oldScale / scaleBy, 0.01); // Limit min scale

  const pointerPosition =
    options?.pointerPosition || calculatePointerPosition(stage);

  const pointerPoint = {
    x: (pointerPosition.x - stage.x()) / oldScale,
    y: (pointerPosition.y - stage.y()) / oldScale,
  };

  const newPos = {
    x: pointerPosition.x - pointerPoint.x * newScale,
    y: pointerPosition.y - pointerPoint.y * newScale,
  };

  stage.to({
    scaleX: newScale,
    scaleY: newScale,
    x: newPos.x,
    y: newPos.y,
    duration: 0.2, // Smooth animation duration
    easing: Konva.Easings.EaseInOut,
  });
};

export const zoomIn = (stage: Konva.Stage) => {
  const centerPointer = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  };

  zoomStage(stage, 1.3, true, { pointerPosition: centerPointer });
};

export const zoomOut = (stage: Konva.Stage) => {
  const centerPointer = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  };

  zoomStage(stage, 1.3, false, { pointerPosition: centerPointer });
};

export const setZoomToPercentage = (stage: Konva.Stage, percentage: number) => {
  const oldScale = stage.scaleX();
  const newScale = Math.min(percentage / 100, 250); // Limit max scale to 250

  const pointerPosition = calculatePointerPosition(stage); // Use normalized pointer position

  const pointerPoint = {
    x: (pointerPosition.x - stage.x()) / oldScale,
    y: (pointerPosition.y - stage.y()) / oldScale,
    duration: 0.2, // Smooth animation duration
    easing: Konva.Easings.EaseInOut,
  };

  const newPos = {
    x: pointerPosition.x - pointerPoint.x * newScale,
    y: pointerPosition.y - pointerPoint.y * newScale,
    duration: 0.2, // Smooth animation duration
    easing: Konva.Easings.EaseInOut,
  };

  stage.to({
    scaleX: newScale,
    scaleY: newScale,
    x: newPos.x,
    y: newPos.y,
    duration: 0.2, // Smooth animation duration
    easing: Konva.Easings.EaseInOut,
  });
};

export const enableMouseWheelZoom = (
  stage: Konva.Stage,
  scaleBy = 1.3,
  onZoomChange?: (zoomLevel: number) => void // Add onZoomChange callback
) => {
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const isZoomIn = e.evt.deltaY < 0; // Zoom in for scroll up
    const pointerPosition = stage.getPointerPosition(); // Use exact mouse position

    if (!pointerPosition) return;

    const oldScale = stage.scaleX();
    const newScale = isZoomIn
      ? Math.min(oldScale * scaleBy, 250) // Limit max scale
      : Math.max(oldScale / scaleBy, 0.01); // Limit min scale

    const pointerPoint = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointerPosition.x - pointerPoint.x * newScale,
      y: pointerPosition.y - pointerPoint.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();

    // Call the onZoomChange callback if provided
    if (onZoomChange) {
      onZoomChange(Math.round(newScale * 100));
    }
  };

  stage.on("wheel", handleWheel);

  // Return cleanup function to remove the event listener
  return () => {
    stage.off("wheel", handleWheel);
  };
};
