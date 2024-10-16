import * as fabric from "fabric";

export const useTriangleTool = (canvas: fabric.Canvas | undefined) => {
  let triangle: fabric.Triangle | null = null;
  let startX = 0;
  let startY = 0;

  const startTriangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;

    triangle = new fabric.Triangle({
      left: startX,
      top: startY,
      width: 0, // Initially set to 0, will expand as the user moves the mouse
      height: 0, // Initially set to 0, will expand as the user moves the mouse
      fill: "transparent",
      stroke: "red",
      strokeWidth: 4,
      selectable: false, // Disable selection while drawing
    });

    canvas.add(triangle);
  };

  const extendTriangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !triangle) return;

    const pointer = canvas.getPointer(event.e);
    const width = pointer.x - startX;
    const height = pointer.y - startY;

    triangle.set({ width: Math.abs(width), height: Math.abs(height) });

    if (width < 0) {
      triangle.set({ left: pointer.x });
    }

    if (height < 0) {
      triangle.set({ top: pointer.y });
    }

    canvas.renderAll();
  };

  const finishTriangle = () => {
    if (!canvas || !triangle) return;

    triangle.set({ selectable: true });
    canvas.setActiveObject(triangle);
    canvas.renderAll();
    triangle = null; // Reset the triangle for the next draw
  };

  return { startTriangle, extendTriangle, finishTriangle };
};
