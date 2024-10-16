import * as fabric from "fabric";

export const useRectangleTool = (canvas: fabric.Canvas | undefined) => {
  let rectangle: fabric.Rect | null = null;
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

  const startRectangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;

    disableObjectSelection(); // Disable selection when the tool starts

    rectangle = new fabric.Rect({
      left: startX,
      top: startY,
      width: 0, // Start with zero width
      height: 0, // Start with zero height
      fill: "transparent",
      stroke: "gray",
      strokeWidth: 1,
      selectable: false,
    });

    canvas.add(rectangle);
  };

  const extendRectangle = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !rectangle) return;

    const pointer = canvas.getPointer(event.e);
    const width = pointer.x - startX;
    const height = pointer.y - startY;

    rectangle.set({ width: Math.abs(width), height: Math.abs(height) });
    rectangle.set({ left: width < 0 ? pointer.x : startX });
    rectangle.set({ top: height < 0 ? pointer.y : startY });

    canvas.renderAll();
  };

  const finishRectangle = () => {
    if (!canvas || !rectangle) return;

    rectangle.set({ selectable: true });
    canvas.setActiveObject(rectangle);
    canvas.renderAll();
    enableObjectSelection(); // Re-enable selection after the tool finishes
    rectangle = null;
  };

  return { startRectangle, extendRectangle, finishRectangle };
};
