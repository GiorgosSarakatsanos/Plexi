import Konva from "konva";
import { Shape } from "./Shape";

export const initiateTextEditing = (
  textShape: Shape,
  currentShape: Konva.Node,
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>,
  shapeId: string,
  container: HTMLDivElement
) => {
  // Get absolute position and scale of the text shape
  const shapePosition = currentShape.getAbsolutePosition();
  const shapeScale = currentShape.getAbsoluteScale();

  // Temporarily hide the text shape on the canvas
  setShapes((prevShapes) =>
    prevShapes.map((shape) =>
      shape.id === shapeId
        ? {
            ...shape,
            fill: "transparent",
          }
        : shape
    )
  );

  // Create a textarea for text editing
  const textarea = document.createElement("textarea");
  textarea.value = textShape.text || "";
  textarea.placeholder = "Edit text here...";
  textarea.style.position = "absolute";

  // Align textarea to match the shape's position and scale
  const containerRect = container.getBoundingClientRect();
  textarea.style.top = `${
    containerRect.top +
    shapePosition.y -
    (textShape.fontSize! * shapeScale.y) / 2
  }px`;
  textarea.style.left = `${containerRect.left + shapePosition.x}px`;
  textarea.style.width = `${(textShape.width || 200) * shapeScale.x}px`;
  textarea.style.height = `${textShape.fontSize! * shapeScale.y * 1.5}px`;
  textarea.style.fontSize = `${textShape.fontSize! * shapeScale.y}px`;
  textarea.style.fontFamily = textShape.fontFamily || "Arial";
  textarea.style.color = textShape.fill;
  textarea.style.border = "1px solid #ccc";
  textarea.style.background = "rgba(255, 255, 255, 0.9)";
  textarea.style.outline = "none";
  textarea.style.padding = "4px";
  textarea.style.margin = "0";
  textarea.style.resize = "none";
  textarea.style.zIndex = "1000";

  // Append and focus the textarea
  document.body.appendChild(textarea);
  textarea.focus();

  // Adjust textarea height dynamically
  const adjustHeight = () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  textarea.addEventListener("input", adjustHeight);
  adjustHeight();

  // Handle blur event to save changes and cleanup
  textarea.addEventListener("blur", () => {
    const newText = textarea.value;

    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              text: newText, // Update the text content
              fill: "black", // Restore the original fill color
            }
          : shape
      )
    );

    document.body.removeChild(textarea); // Clean up
  });
};
