import * as fabric from "fabric";

export const useLineTool = (canvas: fabric.Canvas | undefined) => {
  let line: fabric.Line | null = null;

  const startLine = (event: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e); // Directly use event.e (the actual mouse event)
    const points: [number, number, number, number] = [
      pointer.x,
      pointer.y,
      pointer.x,
      pointer.y,
    ];

    line = new fabric.Line(points, {
      stroke: "black",
      strokeWidth: 2,
      selectable: false,
    });

    canvas.add(line);
  };

  const extendLine = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !line) return;

    const pointer = canvas.getPointer(event.e); // Directly use event.e
    line.set({
      x2: pointer.x,
      y2: pointer.y,
    });

    canvas.renderAll();
  };

  const finishLine = () => {
    if (!canvas || !line) return;

    line.set({ selectable: true });
    canvas.setActiveObject(line);
    canvas.renderAll();
    line = null;
  };

  return { startLine, extendLine, finishLine };
};
