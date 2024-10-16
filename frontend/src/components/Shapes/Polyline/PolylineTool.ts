import * as fabric from "fabric";

export const usePolylineTool = (canvas: fabric.Canvas | undefined) => {
  let polyline: fabric.Polyline | null = null;
  let points: fabric.Point[] = [];

  const startPolyline = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e); // Get the pointer position on canvas
    const point = new fabric.Point(pointer.x, pointer.y);

    // Add the clicked point to the points array
    points.push(point);

    // If more than one point, start or update the polyline
    if (points.length > 1) {
      if (polyline) {
        canvas.remove(polyline); // Remove the previous version of the polyline
      }

      // Create a new polyline using the points
      polyline = new fabric.Polyline(points, {
        stroke: "red",
        strokeWidth: 2,
        fill: "transparent",
        selectable: false, // Prevent moving while drawing
      });

      canvas.add(polyline); // Add the polyline to the canvas
    } else {
      // Start a new polyline with the first point
      polyline = new fabric.Polyline([point], {
        stroke: "red",
        strokeWidth: 2,
        fill: "transparent",
        selectable: false,
      });

      canvas.add(polyline); // Add the first point as a start
    }
    canvas.renderAll(); // Update canvas to show the changes
  };

  const finishPolyline = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (!canvas || !polyline) return;

      // Finalize polyline, make it selectable
      polyline.set({ selectable: true });
      canvas.setActiveObject(polyline);
      canvas.renderAll();

      // Reset the points array and polyline
      points = [];
      polyline = null;
    }
  };

  return { startPolyline, finishPolyline };
};
