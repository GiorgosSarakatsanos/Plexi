import Konva from "konva";
import { Shape } from "../helpers/Shape";
import { initiateTextEditing } from "../helpers/initiateTextEditing";

export const handleDoubleClick = (
  shapeId: string,
  shapes: Shape[],
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>,
  stageRef: React.RefObject<Konva.Stage>
) => {
  // Find the text shape based on its ID and type
  const textShape = shapes.find(
    (shape) => shape.id === shapeId && shape.type === "text"
  );
  if (!textShape) return;

  const stage = stageRef.current;
  if (!stage) return;

  const currentShape = stage.findOne(`#${shapeId}`);
  if (!currentShape) return;

  // Call the text editing helper
  initiateTextEditing(
    textShape,
    currentShape,
    setShapes,
    shapeId,
    stage.container()
  );
};
