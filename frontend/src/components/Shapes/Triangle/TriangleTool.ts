import * as fabric from "fabric";

export const useTriangleTool = (canvas: fabric.Canvas | undefined) => {
  let triangle: fabric.Triangle | null = null;
  let startX = 0;
  let startY = 0;

  const disableObjectSelection = () => {
    if (!canvas) return;
    canvas.selection = false;
    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });
  };

  const enableObjectSelection = () => {
    if (!canvas) return;
    canvas.selection = true;
    canvas.forEachObject((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });
  };

  const startTriangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    // Get starting position and disable selection
    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;

    // Create the triangle
    triangle = new fabric.Triangle({
      left: startX,
      top: startY,
      width: 0, // Initially 0, will expand as user moves the mouse
      height: 0, // Initially 0, will expand as user moves the mouse
      fill: "transparent",
      stroke: "red",
      strokeWidth: 4,
      selectable: false, // Disable selection while drawing
    });

    disableObjectSelection(); // Disable object selection while drawing

    canvas.add(triangle); // Add triangle to canvas
  };

  const extendTriangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !triangle) return;

    // Get current pointer position
    const pointer = canvas.getPointer(event.e);
    const width = pointer.x - startX;
    const height = pointer.y - startY;

    // Update triangle size and position
    triangle.set({ width: Math.abs(width), height: Math.abs(height) });

    if (width < 0) {
      triangle.set({ left: pointer.x });
    }

    if (height < 0) {
      triangle.set({ top: pointer.y });
    }

    canvas.renderAll(); // Redraw canvas with updated triangle
  };

  const finishTriangle = () => {
    if (!canvas || !triangle) return;

    // Enable object selection after drawing
    triangle.set({ selectable: true });
    canvas.setActiveObject(triangle);
    canvas.renderAll();

    enableObjectSelection(); // Re-enable object selection
    triangle = null; // Reset triangle for future use
  };

  return { startTriangle, extendTriangle, finishTriangle };
};
