import Konva from "konva";

export const zoomIn = (stage: Konva.Stage) => {
  const oldScale = stage.scaleX();
  const scaleBy = 1.5;

  const newScale = Math.min(oldScale * scaleBy, 250); // Limit scale to 250 (25000%)

  const viewCenter = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  };

  const pointerPoint = {
    x: (viewCenter.x - stage.x()) / oldScale,
    y: (viewCenter.y - stage.y()) / oldScale,
  };

  const newPos = {
    x: viewCenter.x - pointerPoint.x * newScale,
    y: viewCenter.y - pointerPoint.y * newScale,
  };

  stage.scale({ x: newScale, y: newScale });
  stage.position(newPos);
  stage.batchDraw();
};

export const zoomOut = (stage: Konva.Stage) => {
  const oldScale = stage.scaleX();
  const scaleBy = 1.5;

  const newScale = Math.max(oldScale / scaleBy, 0.01); // Prevent scale from going too small

  const viewCenter = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  };

  const pointerPoint = {
    x: (viewCenter.x - stage.x()) / oldScale,
    y: (viewCenter.y - stage.y()) / oldScale,
  };

  const newPos = {
    x: viewCenter.x - pointerPoint.x * newScale,
    y: viewCenter.y - pointerPoint.y * newScale,
  };

  stage.scale({ x: newScale, y: newScale });
  stage.position(newPos);
  stage.batchDraw();
};

export const setZoomToPercentage = (stage: Konva.Stage, percentage: number) => {
  const newScale = Math.min(percentage / 100, 250); // Limit scale to 250

  const viewCenter = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  };

  const pointerPoint = {
    x: (viewCenter.x - stage.x()) / stage.scaleX(),
    y: (viewCenter.y - stage.y()) / stage.scaleY(),
  };

  const newPos = {
    x: viewCenter.x - pointerPoint.x * newScale,
    y: viewCenter.y - pointerPoint.y * newScale,
  };

  stage.scale({ x: newScale, y: newScale });
  stage.position(newPos);
  stage.batchDraw();
};
