import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import {
  Stage,
  Layer,
  Transformer,
  Rect,
  Ellipse,
  Line,
  RegularPolygon,
} from "react-konva";
import {
  zoomIn,
  zoomOut,
  setZoomToPercentage,
  enableMouseWheelZoom,
} from "../Zoom/Zoom";
import { generateId } from "../../utils/idGenerator";
import { usePointerPosition } from "../Shape/usePointerPosition";
import { useLayerContext } from "../Layer/useLayerContext";
import Konva from "konva";

interface CanvasProps {
  backgroundColor: string;
  opacity: number;
  width: string;
  height: string;
  onZoomChange: (zoomLevel: number) => void;
  selectedShape: "rect" | "ellipse" | "line" | "hexagon" | null;
}

export interface CanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomToPercentage: (percentage: number) => void;
  getStage: () => Konva.Stage | null;
  selectShapeById: (shapeId: string) => void; // Add this line
}

interface Shape {
  id: string;
  type: "rect" | "ellipse" | "line" | "hexagon";
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  layerId: string;
  radius?: number; // For hexagon
}

const Canvas = React.forwardRef<CanvasRef, CanvasProps>((props, ref) => {
  const { width, height, onZoomChange, selectedShape } = props;

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const getPointerPosition = usePointerPosition(stageRef);

  const { addLayer, setSelectedLayerIds } = useLayerContext();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // Function to select a shape by ID
  const selectShapeById = (shapeId: string) => {
    const shape = shapes.find((s) => s.id === shapeId);
    if (shape) {
      setSelectedShapeId(shape.id);
      setSelectedLayerIds([shape.layerId]); // Highlight the related layer
    }
  };

  // Zoom area

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (stageRef.current) zoomIn(stageRef.current);
    },
    zoomOut: () => {
      if (stageRef.current) zoomOut(stageRef.current);
    },
    setZoomToPercentage: (percentage: number) => {
      if (stageRef.current) {
        setZoomToPercentage(stageRef.current, percentage);
        onZoomChange(Math.round(stageRef.current.scaleX() * 100));
      }
    },
    getStage: () => stageRef.current,
    selectShapeById, // Expose the selection function
  }));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cleanup = enableMouseWheelZoom(stage, 1.3, (zoomLevel) => {
      onZoomChange(zoomLevel); // Update zoom level state
    });

    return () => {
      cleanup();
    };
  }, [onZoomChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsPanning(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (!transformer || !stage || !selectedShapeId) return;

    const selectedNode = stage.findOne(`#${selectedShapeId}`);
    if (selectedNode) {
      transformer.nodes([selectedNode]);
      transformer.getLayer()?.batchDraw();
    } else {
      transformer.nodes([]);
    }
  }, [selectedShapeId, shapes]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectedShape === "select") {
      const clickedShapeId = e.target?.id();
      if (clickedShapeId) {
        const clickedShape = shapes.find(
          (shape) => shape.id === clickedShapeId
        );
        if (clickedShape) {
          setSelectedShapeId(clickedShape.id);
          setSelectedLayerIds([clickedShape.layerId]);
        }
      } else {
        setSelectedShapeId(null); // Deselect if clicked on empty area
      }
      return;
    }

    if (!selectedShape) return; // No shape selected

    const pointerPos = getPointerPosition(); // Get the pointer position
    const id = generateId();
    const layerId = generateId();
    addLayer(selectedShape, layerId);

    let newShape: Shape;

    if (selectedShape === "line") {
      // Line-specific initialization
      newShape = {
        id: `shape-${id}`,
        type: "line",
        x: 0, // Not used for line but required for Shape interface
        y: 0,
        points: [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y],
        fill: "transparent",
        stroke: "blue",
        strokeWidth: 1,
        layerId,
      };
    } else {
      // General initialization for other shapes
      newShape = {
        id: `shape-${id}`,
        type: selectedShape,
        x: pointerPos.x,
        y: pointerPos.y,
        width: 0, // Will be updated dynamically
        height: 0,
        fill: "transparent",
        stroke: "blue",
        strokeWidth: 1,
        layerId,
      };
    }

    setDrawingShape(newShape);
    setSelectedLayerIds([layerId]);
    setIsDrawing(true);
  };

  const handleMouseMove = () => {
    if (!drawingShape) return;

    const pointerPos = getPointerPosition(); // Get the pointer position

    setDrawingShape((prev) => {
      if (!prev) return null;

      if (prev.type === "line") {
        // Update line's endpoint
        const [startX, startY] = prev.points!;
        return {
          ...prev,
          points: [startX, startY, pointerPos.x, pointerPos.y],
        };
      } else if (prev.type === "rect" || prev.type === "ellipse") {
        // Update width and height for other shapes
        return {
          ...prev,
          width: pointerPos.x - prev.x,
          height: pointerPos.y - prev.y,
        };
      } else if (prev.type === "hexagon") {
        // Update radius for hexagon
        const radius = Math.sqrt(
          Math.pow(pointerPos.x - prev.x, 2) +
            Math.pow(pointerPos.y - prev.y, 2)
        );
        return {
          ...prev,
          radius,
        };
      }

      return prev;
    });
  };

  const handleMouseUp = () => {
    if (!drawingShape) return;

    setShapes((prevShapes) => [...prevShapes, drawingShape]);
    setSelectedShapeId(drawingShape.id); // Select the created shape
    setDrawingShape(null);
    setIsDrawing(false);
  };

  const renderShape = (shape: Shape) => {
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      draggable: !isDrawing && !isPanning,
      strokeScaleEnabled: false,
      onClick:
        selectedShape === "select"
          ? () => {
              setSelectedShapeId(shape.id);
              setSelectedLayerIds([shape.layerId]);
            }
          : undefined, // Disable click when not in "Select" mode
    };

    switch (shape.type) {
      case "rect":
        return (
          <Rect
            {...commonProps}
            width={shape.width || 0}
            height={shape.height || 0}
          />
        );
      case "ellipse":
        return (
          <Ellipse
            {...commonProps}
            radiusX={(shape.width || 0) / 2}
            radiusY={(shape.height || 0) / 2}
          />
        );
      case "line":
        return <Line {...commonProps} points={shape.points || []} />;
      case "hexagon":
        return (
          <RegularPolygon
            {...commonProps}
            sides={6}
            radius={shape.radius || 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stage
      width={parseInt(width)}
      height={parseInt(height)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      draggable={isPanning}
      ref={stageRef}
    >
      <Layer>
        {shapes.map(renderShape)}
        {drawingShape && renderShape({ ...drawingShape })}
        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  );
});

export default Canvas;
