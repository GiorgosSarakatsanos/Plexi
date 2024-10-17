import * as fabric from "fabric"; // Import fabric.js
import { commonShapeProps } from "./CommonShapeProps"; // Import common properties

// Define a centralized map of shapes and their creation logic
export const shapeDataMap = {
  rect: {
    create: () => new fabric.Rect({ ...commonShapeProps }),
    extend: true, // Rectangle can be extended while drawing
  },
  triangle: {
    create: () => new fabric.Triangle({ ...commonShapeProps }),
    extend: true, // Triangle can be extended while drawing
  },
  ellipse: {
    create: () =>
      new fabric.Ellipse({
        ...commonShapeProps,
        rx: 0, // Initial radius
        ry: 0,
      }),
    extend: true, // Ellipse has special extension behavior
  },
  line: {
    create: () => new fabric.Line([0, 0, 0, 0], { ...commonShapeProps }),
    extend: true, // Line can be extended as mouse moves
  },
  text: {
    create: (text = "Your text") =>
      new fabric.IText(text, {
        fontSize: 24,
        fill: "black",
      }),
    extend: false, // Text is static and doesn't need extension logic
  },
};
