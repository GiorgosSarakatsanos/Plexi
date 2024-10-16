import * as fabric from "fabric";

export const useEllipseTool = (canvas: fabric.Canvas | undefined) => {
  let ellipse: fabric.Ellipse | null = null;
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

  const startEllipse = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;

    disableObjectSelection(); // Disable selection when the tool starts

    ellipse = new fabric.Ellipse({
      left: startX,
      top: startY,
      rx: 0,
      ry: 0,
      fill: "transparent",
      stroke: "gray",
      strokeWidth: 1,
      selectable: false,
    });

    canvas.add(ellipse);
  };

  const extendEllipse = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !ellipse) return;

    const pointer = canvas.getPointer(event.e);
    const radiusX = Math.abs(pointer.x - startX) / 2;
    const radiusY = Math.abs(pointer.y - startY) / 2;

    ellipse.set({
      rx: radiusX,
      ry: radiusY,
      left: startX - radiusX,
      top: startY - radiusY,
    });

    canvas.renderAll();
  };

  const finishEllipse = () => {
    if (!canvas || !ellipse) return;

    ellipse.set({ selectable: true });
    canvas.setActiveObject(ellipse);
    canvas.renderAll();
    enableObjectSelection(); // Re-enable selection after the tool finishes
    ellipse = null;
  };

  return { startEllipse, extendEllipse, finishEllipse };
};
