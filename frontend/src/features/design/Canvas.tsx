import Konva from "konva";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { ToolManager } from "./helpers/ToolManager";
import ShapeRenderer from "./helpers/ShapeRenderer";
import { Shape } from "./helpers/Shape";
import { useTransformer } from "./helpers/useTransformer";
import { useLayerContext } from "./Layer/useLayerContext";
import { handleDoubleClick } from "./mouseActions/handleDoubleClick";
import { AreaTool } from "./Tools/AreaTool";
import { SelectedShape } from "./helpers/ToolTypes";

export interface CanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomToPercentage: (percentage: number) => void;
  getStage: () => Konva.Stage | null;
  selectShapeById: (shapeId: string) => void;
  handleUploadImage: () => void;
}

interface CanvasProps {
  selectedTool: SelectedShape;
  setSelectedTool: React.Dispatch<React.SetStateAction<SelectedShape>>;
}

const Canvas: React.FC<CanvasProps> = ({ selectedTool, setSelectedTool }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);

  const {
    addLayer,
    selectedLayerIds,
    selectLayer,
    deselectLayer,
    setSelectedLayerIds,
  } = useLayerContext();

  const stageRef = useRef<Konva.Stage>(null);
  const { transformerRef, applyTransformer, clearTransformer } =
    useTransformer();

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
    if (selectedLayerIds.length > 0) {
      applyTransformer(stageRef, selectedLayerIds[selectedLayerIds.length - 1]);
    } else {
      clearTransformer();
    }
  }, [selectedLayerIds, applyTransformer, clearTransformer]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const { ctrlKey, shiftKey } = e.evt;

    if (e.target === stageRef.current) {
      deselectLayer();
      clearTransformer();
    } else {
      const clickedShape = shapes.find(
        (shape) => shape.layerId === e.target.attrs.layerId
      );

      if (clickedShape) {
        selectLayer(clickedShape.layerId, ctrlKey, shiftKey);
        setSelectedLayerIds([clickedShape.layerId]);
      }
    }
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    console.log(`Shape ${id} moved to (${x}, ${y})`);
    setShapes((prevShapes) =>
      prevShapes.map((shape) => (shape.id === id ? { ...shape, x, y } : shape))
    );
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
          (id: string) => selectLayer(id),
          setSelectedLayerIds
        )
      }
    >
      <Layer>
        {shapes.map((shape) => (
          <ShapeRenderer
            key={shape.id}
            shape={shape}
            isDrawing={!!drawingShape}
            selected={selectedLayerIds.includes(shape.layerId)}
            isPanning={false}
            setShapes={setShapes}
            handleDragEnd={handleDragEnd}
            handleDoubleClick={(id) =>
              handleDoubleClick(id, shapes, setShapes, stageRef)
            }
            selectedShape={selectedTool}
            onClick={() => selectLayer(shape.layerId)} // Ensure shape.layerId is always a string
            setSelectedShapeId={(idOrUpdater) => {
              if (typeof idOrUpdater === "function") {
                const id = idOrUpdater(null);
                if (id !== null) selectLayer(id);
              } else if (idOrUpdater !== null) {
                selectLayer(idOrUpdater);
              }
            }}
            setSelectedLayerIds={setSelectedLayerIds}
          />
        ))}
        {drawingShape && (
          <ShapeRenderer
            shape={drawingShape}
            isDrawing={true}
            isPanning={false}
            setShapes={setShapes}
            handleDragEnd={handleDragEnd}
            handleDoubleClick={(id) =>
              handleDoubleClick(id, shapes, setShapes, stageRef)
            }
            selectedShape={selectedTool}
            selected={false}
            setSelectedShapeId={() => {}} // No-op function for drawing shapes
            setSelectedLayerIds={() => {}} // No-op function for drawing shapes
          />
        )}

        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  );
};

export default Canvas;
