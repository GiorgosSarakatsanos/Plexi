import * as fabric from "fabric";

export const useRectangleTool = (canvas: fabric.Canvas | undefined) => {
  let rect: fabric.Rect | null = null;
  let startX = 0;
  let startY = 0;

  const startRectangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;

    rect = new fabric.Rect({
      left: startX,
      top: startY,
      width: 0,
      height: 0,
      fill: "white",
      stroke: "black",
      strokeDashArray: [0, 0],
      strokeWidth: 1,
      selectable: false,
    });

    canvas.add(rect);
  };

  const extendRectangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !rect) return;

    const pointer = canvas.getPointer(event.e);

    // Update the width and height of the rectangle
    const width = pointer.x - startX;
    const height = pointer.y - startY;

    rect.set({
      width: Math.abs(width),
      height: Math.abs(height),
      left: width < 0 ? pointer.x : startX,
      top: height < 0 ? pointer.y : startY,
    });

    canvas.renderAll();
  };

  const finishRectangle = () => {
    if (!canvas || !rect) return;

    // Make the rectangle selectable after drawing
    rect.set({ selectable: true });
    canvas.setActiveObject(rect);
    canvas.renderAll();

    rect = null;
  };

  return { startRectangle, extendRectangle, finishRectangle };
};
