// createShapeBase.ts

export const createShapeBase = (pointerPos: { x: number; y: number }) => ({
  x: pointerPos.x,
  y: pointerPos.y,
  fill: "transparent",
  stroke: "blue",
  strokeWidth: 2,
  layerId: "",
  draggable: true,
  listening: true,
});
