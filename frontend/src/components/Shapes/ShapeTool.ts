import * as fabric from "fabric";
import { shapeDataMap } from "./ShapeDataMap"; // Import the shape data map

export const useShapeTool = (canvas: fabric.Canvas | undefined) => {
  const addShape = (shapeType: keyof typeof shapeDataMap) => {
    if (!canvas) return;

    const shapeData = shapeDataMap[shapeType];
    if (!shapeData) {
      console.error(`Shape type '${shapeType}' does not exist.`);
      return;
    }

    let shape: fabric.Object | null = null;
    let startX = 0;
    let startY = 0;

    const startShape = (
      event: fabric.TPointerEventInfo<fabric.TPointerEvent>
    ) => {
      const pointer = canvas.getPointer(event.e);
      startX = pointer.x;
      startY = pointer.y;

      // Handle text creation using data from ShapeDataMap
      if (shapeType === "text") {
        shape = shapeData.create(); // Use the text creation logic from ShapeDataMap
        shape.set({
          left: startX,
          top: startY,
        });
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();

        // Disable further text addition by removing the mouse:down listener
        canvas.off("mouse:down", startShape);
        return;
      }

      // Disable selection box for other shapes
      canvas.selection = false;
      canvas.forEachObject((obj) => {
        obj.selectable = false;
      });

      // Create other shapes (e.g., Line, Rectangle, Ellipse, Triangle)
      shape = shapeData.create();

      if (shape instanceof fabric.Line) {
        shape.set({ x1: startX, y1: startY, x2: startX, y2: startY });
      } else if (
        shape instanceof fabric.Triangle ||
        shape instanceof fabric.Rect
      ) {
        shape.set({ left: startX, top: startY, width: 0, height: 0 });
      } else if (shape instanceof fabric.Ellipse) {
        shape.set({ left: startX, top: startY, rx: 0, ry: 0 });
      }

      if (shape) {
        canvas.add(shape);
      }
    };

    const extendShape = (
      event: fabric.TPointerEventInfo<fabric.TPointerEvent>
    ) => {
      if (!canvas || !shape) return;

      const pointer = canvas.getPointer(event.e);
      const width = Math.abs(pointer.x - startX);
      const height = Math.abs(pointer.y - startY);

      if (shape instanceof fabric.Line) {
        shape.set({ x2: pointer.x, y2: pointer.y });
      } else if (
        shape instanceof fabric.Triangle ||
        shape instanceof fabric.Rect
      ) {
        shape.set({ width, height });
        if (pointer.x < startX) shape.set({ left: pointer.x });
        if (pointer.y < startY) shape.set({ top: pointer.y });
      } else if (shape instanceof fabric.Ellipse) {
        const rx = width / 2;
        const ry = height / 2;
        shape.set({
          rx,
          ry,
          left: startX - rx,
          top: startY - ry,
        });
      }

      canvas.renderAll();
    };

    const finishShape = () => {
      if (!shape) return;

      shape.set({ selectable: true });
      canvas.setActiveObject(shape);
      canvas.renderAll();

      // Re-enable selection box after drawing
      canvas.selection = true;
      canvas.forEachObject((obj) => {
        obj.selectable = true;
      });

      shape = null; // Reset the shape for future drawings
    };

    // Event listeners for non-text shapes
    canvas.on("mouse:down", startShape);
    if (shapeType !== "text") {
      canvas.on("mouse:move", extendShape);
    }
    canvas.on("mouse:up", () => {
      finishShape();
      canvas.off("mouse:down", startShape);
      if (shapeType !== "text") {
        canvas.off("mouse:move", extendShape);
      }
      canvas.off("mouse:up", finishShape);
    });
  };

  return { addShape };
};
