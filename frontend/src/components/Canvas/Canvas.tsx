import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { ToolManager } from "../Tools/ToolManager";
import ShapeRenderer from "../Shape/ShapeRenderer";
import { Shape } from "../Shape/Shape";
import { SelectedShape } from "../Tools/ToolTypes";
import { useLayerContext } from "../Layer/useLayerContext";
import { applyTransformer } from "../../utils/applyTransformer";
import Konva from "konva";

interface CanvasProps {
  selectedTool: SelectedShape;
  setSelectedTool: React.Dispatch<React.SetStateAction<SelectedShape>>;
}

export interface CanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomToPercentage: (percentage: number) => void;
  getStage: () => Konva.Stage | null;
  selectShapeById: (shapeId: string) => void; // Add this line
  handleUploadImage: () => void; // Add this
}

const Canvas: React.FC<CanvasProps> = ({ selectedTool, setSelectedTool }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const { addLayer, setSelectedLayerIds } = useLayerContext();
  const transformerRef = useRef<Konva.Transformer>(null);

  const { setLayers } = useLayerContext();
  if (!setLayers) {
    throw new Error("setLayers is not defined in the LayerContext");
  }

  useEffect(() => {
    applyTransformer(stageRef, transformerRef, selectedShapeId);
  }, [selectedShapeId, shapes]);

  const handleDragEnd = (id: string, x: number, y: number) => {
    console.log(`Shape ${id} moved to (${x}, ${y})`);
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === stageRef.current) {
      // Deselect any selected shape
      setSelectedShapeId(null);
      setSelectedLayerIds([]);
    }
  };

  const stageRef = useRef<Konva.Stage>(null);

  const currentTool = ToolManager[selectedTool];

  const handleDoubleClick = (shapeId: string) => {
    const textShape = shapes.find(
      (shape) => shape.id === shapeId && shape.type === "text"
    );
    if (!textShape) return;

    const stage = stageRef.current;
    if (!stage) return;

    const container = stage.container();
    const currentShape = stage.findOne(`#${shapeId}`);
    if (!currentShape) return;

    // Get the absolute position of the text shape
    const shapePosition = currentShape.getAbsolutePosition();
    const shapeScale = currentShape.getAbsoluteScale(); // Includes scale transformations

    // Temporarily hide the text on the canvas
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

    // Create a textarea for multiline editing
    const textarea = document.createElement("textarea");
    textarea.value = textShape.text || "";
    textarea.placeholder = "Edit text here..."; // Placeholder text
    textarea.style.position = "absolute";

    // Align textarea to the exact position and scale of the text on canvas
    const containerRect = container.getBoundingClientRect();
    textarea.style.top = `${
      containerRect.top +
      shapePosition.y -
      (textShape.fontSize! * shapeScale.y) / 2
    }px`;
    textarea.style.left = `${containerRect.left + shapePosition.x}px`;

    // Style the textarea to match the text shape
    textarea.style.width = `${(textShape.width || 200) * shapeScale.x}px`; // Adjust width
    textarea.style.height = `${textShape.fontSize! * shapeScale.y * 1.5}px`; // Adjust height based on font size
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

    // Append the textarea to the document body and focus it
    document.body.appendChild(textarea);
    textarea.focus();

    // Adjust the height dynamically based on the content
    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    textarea.addEventListener("input", adjustHeight);
    adjustHeight(); // Initial adjustment

    // Restore the text and save changes when the textarea loses focus
    textarea.addEventListener("blur", () => {
      const newText = textarea.value;

      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === shapeId
            ? {
                ...shape,
                text: newText, // Update the text value
                fill: "black", // Restore original color
              }
            : shape
        )
      );

      // Clean up the textarea
      document.body.removeChild(textarea);
    });
  };

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={(e) => {
        currentTool.handleMouseDown(e, stageRef, setDrawingShape);
        handleStageClick(e);
      }}
      onMouseMove={(e) =>
        currentTool.handleMouseMove(e, drawingShape, setDrawingShape)
      }
      onMouseUp={() =>
        currentTool.handleMouseUp(
          setShapes,
          drawingShape,
          setDrawingShape,
          setSelectedTool,
          stageRef,
          addLayer,
          transformerRef,
          setSelectedShapeId // Pass setSelectedShapeId here
        )
      }
    >
      <Layer>
        {shapes.map((shape) => (
          <ShapeRenderer
            key={shape.id}
            shape={shape}
            isDrawing={!!drawingShape}
            isPanning={false}
            setShapes={setShapes}
            setSelectedShapeId={setSelectedShapeId}
            setSelectedLayerIds={setSelectedLayerIds}
            handleDragEnd={handleDragEnd}
            handleDoubleClick={handleDoubleClick}
            selectedShape={selectedTool}
          />
        ))}
        {drawingShape && (
          <ShapeRenderer
            shape={drawingShape}
            isDrawing={true}
            isPanning={false}
            setShapes={setShapes}
            setSelectedShapeId={setSelectedShapeId}
            setSelectedLayerIds={setSelectedLayerIds}
            handleDragEnd={handleDragEnd}
            handleDoubleClick={handleDoubleClick}
            selectedShape={selectedTool}
          />
        )}
        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  );
};

export default Canvas;
