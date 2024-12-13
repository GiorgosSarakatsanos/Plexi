export const createShapeBase = (
  pointerPos: { x: number; y: number },
  layerId: string
) => ({
  x: pointerPos.x,
  y: pointerPos.y,
  fill: "transparent",
  stroke: "blue",
  strokeWidth: 2,
  layerId, // Dynamically assign `layerId`
  draggable: true,
  listening: true,
});
