import * as fabric from "fabric";

export const startFreehandDraw = (canvas: fabric.Canvas) => {
  let isDrawing = false;
  let currentPath: fabric.Path | null = null;
  let points: fabric.TSimpleParsedCommand[] = []; // Array for parsed path commands

  canvas.isDrawingMode = false; // Disable Fabric's built-in drawing mode

  canvas.on("mouse:down", (event) => {
    isDrawing = true;
    points = []; // Reset points on each new draw
    const pointer = canvas.getPointer(event.e);
    points.push(["M", pointer.x, pointer.y]); // Move to start point
  });

  canvas.on("mouse:move", (event) => {
    if (!isDrawing) return;
    const pointer = canvas.getPointer(event.e);
    points.push(["L", pointer.x, pointer.y]); // Add line to point

    if (currentPath) {
      canvas.remove(currentPath); // Remove the previous path to prevent duplication
    }

    currentPath = new fabric.Path(points, {
      fill: "",
      stroke: "black",
      strokeWidth: 2,
      selectable: false,
    });

    canvas.add(currentPath);
    canvas.renderAll();
  });

  canvas.on("mouse:up", () => {
    isDrawing = false;
    currentPath = null; // Reset the path after finishing the draw
  });
};
