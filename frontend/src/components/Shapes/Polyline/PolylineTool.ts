import * as fabric from "fabric";

export const usePolylineTool = (canvas: fabric.Canvas | undefined) => {
  let polyline: fabric.Polyline | null = null;
  let points: fabric.Point[] = [];

  const startPolyline = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    const point = new fabric.Point(pointer.x, pointer.y);

    // If this is the first click, create a polyline starting with the first point
    if (!polyline) {
      points.push(point);
      polyline = new fabric.Polyline(points, {
        stroke: "red",
        strokeWidth: 2,
        fill: "transparent",
        selectable: false, // Prevent moving while drawing
      });
      canvas.add(polyline); // Add the polyline to the canvas
    } else {
      // If polyline already exists, add a new point when mouse is released
      points.push(point);
      polyline.set({ points }); // Update the polyline with the new points
    }

    canvas.renderAll(); // Update the canvas to show changes
  };

  const extendPolyline = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    if (!canvas || !polyline) return;

    const pointer = canvas.getPointer(event.e);
    const lastPointIndex = points.length - 1;

    // Update the last point of the polyline as the mouse moves
    points[lastPointIndex] = new fabric.Point(pointer.x, pointer.y);
    polyline.set({ points });

    canvas.renderAll(); // Render the canvas to show the updated polyline
  };

  const finishPolyline = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (!canvas || !polyline) return;

      // Finalize polyline and make it selectable
      polyline.set({ selectable: true });
      canvas.setActiveObject(polyline);
      canvas.renderAll();

      // Reset the tool
      points = [];
      polyline = null;
    }
  };

  return { startPolyline, extendPolyline, finishPolyline };
};
