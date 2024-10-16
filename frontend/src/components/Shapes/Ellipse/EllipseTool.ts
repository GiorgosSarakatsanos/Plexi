import * as fabric from "fabric";

export const useEllipseTool = (canvas: fabric.Canvas | undefined) => {
  let ellipse: fabric.Ellipse | null = null;
  let startX = 0;
  let startY = 0;

  const startEllipse = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;

    ellipse = new fabric.Ellipse({
      left: startX,
      top: startY,
      rx: 0, // Radius X, initially 0, will expand based on mouse movement
      ry: 0, // Radius Y, initially 0, will expand based on mouse movement
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
    ellipse = null;
  };

  return { startEllipse, extendEllipse, finishEllipse };
};
