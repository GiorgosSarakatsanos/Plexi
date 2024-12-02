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
      <Layer id="preview-layer"></Layer>
    </Stage>
  );
};

export default Canvas;
