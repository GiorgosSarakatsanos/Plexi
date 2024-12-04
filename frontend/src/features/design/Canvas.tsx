import Konva from "konva";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { ToolManager } from "./helpers/ToolManager";
import ShapeRenderer from "./helpers/ShapeRenderer";
import { Shape } from "./helpers/Shape";
import { SelectedShape } from "./helpers//ToolTypes";
import { applyTransformer } from "./helpers//applyTransformer";
import { useLayerContext } from "./Layer/useLayerContext";
import { handleDoubleClick } from "./mouseActions/handleDoubleClick";
import { AreaTool } from "./Tools/AreaTool";

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

  const stageRef = useRef<Konva.Stage>(null);

  const handleAddShape = (width: number, height: number) => {
    const x = Math.random() * 200; // Random x position
    const y = Math.random() * 200; // Random y position
    AreaTool.addShapeToStage?.(stageRef, setShapes, x, y, width, height);
  };

  useEffect(() => {
    const handleAddShapeEvent = (
      e: CustomEvent<{ width: number; height: number }>
    ) => {
      const { width, height } = e.detail;
      handleAddShape(width, height);
    };

    window.addEventListener("addShape", handleAddShapeEvent as EventListener);

    return () => {
      window.removeEventListener(
        "addShape",
        handleAddShapeEvent as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const logSelectedShapeDetails = (shapeId: string | null) => {
      if (!shapeId) {
        console.log("No shape selected");
        return;
      }

      const selectedShape = shapes.find((shape) => shape.id === shapeId);
      if (!selectedShape) {
        console.log("Shape not found");
        return;
      }

      console.log("Selected Shape Details:");
      console.log("Shape ID:", selectedShape.id);
      console.log("Shape Type:", selectedShape.type);
      console.log("Layer ID:", selectedShape.layerId || "None");
      console.log("Group:", selectedShape.groupId || "None");
    };

    applyTransformer(stageRef, transformerRef, selectedShapeId);
    logSelectedShapeDetails(selectedShapeId); // Log the details of the selected shape
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

  const currentTool = ToolManager[selectedTool];

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
          setSelectedShapeId
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
            handleDoubleClick={(id) =>
              handleDoubleClick(id, shapes, setShapes, stageRef)
            }
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
            handleDoubleClick={(id) =>
              handleDoubleClick(id, shapes, setShapes, stageRef)
            }
            selectedShape={selectedTool}
          />
        )}
        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  );
};

export default Canvas;
