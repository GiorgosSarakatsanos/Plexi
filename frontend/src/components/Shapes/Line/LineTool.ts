import * as fabric from "fabric";

export const useLineTool = (canvas: fabric.Canvas | undefined) => {
  let line: fabric.Line | null = null;

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

  const startLine = (event: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
    if (!canvas) return;

    // Get pointer position from the event
    const pointer = canvas.getPointer(event.e);
    const points: [number, number, number, number] = [
      pointer.x,
      pointer.y,
      pointer.x,
      pointer.y,
    ];

    // Create the line object
    line = new fabric.Line(points, {
      stroke: "black",
      strokeWidth: 2,
      selectable: false, // Make sure the line isn't selectable while drawing
    });

    // Disable object selection on the canvas when drawing starts
    disableObjectSelection();

    // Add the line to the canvas
    canvas.add(line);
  };

  const extendLine = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !line) return;

    const pointer = canvas.getPointer(event.e);

    // Update the end point of the line as the mouse moves
    line.set({
      x2: pointer.x,
      y2: pointer.y,
    });

    canvas.renderAll(); // Render the changes on the canvas
  };

  const finishLine = () => {
    if (!canvas || !line) return;

    // Once the line is done, make it selectable
    line.set({ selectable: true });
    canvas.setActiveObject(line);
    canvas.renderAll();

    // Enable object selection after drawing finishes
    enableObjectSelection();

    // Reset the line for future use
    line = null;
  };

  return { startLine, extendLine, finishLine };
};
