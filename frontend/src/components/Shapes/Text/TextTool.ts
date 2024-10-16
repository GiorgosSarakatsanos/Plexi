import * as fabric from "fabric";

export const useTextTool = (canvas: fabric.Canvas | undefined) => {
  const addText = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>,
    text: string,
    fontSize: number,
    fill: string
  ) => {
    if (!canvas) return;

    // Get the pointer position where the mouse was clicked
    const pointer = canvas.getPointer(event.e);

    // Create a new fabric.IText instance
    const iText = new fabric.IText(text, {
      left: pointer.x, // Set X position
      top: pointer.y, // Set Y position
      fontSize: fontSize,
      fill: fill,
    });

    // Add the text to the canvas and set it as the active object
    canvas.add(iText);
    canvas.setActiveObject(iText);
    canvas.renderAll();
  };

  return { addText };
};
