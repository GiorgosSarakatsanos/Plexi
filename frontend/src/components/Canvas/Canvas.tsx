import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useContext,
} from "react";
import { Stage, Layer, Transformer, Rect, Ellipse, Line } from "react-konva";
import Konva from "konva";
import {
  zoomIn,
  zoomOut,
  setZoomToPercentage,
  enableMouseWheelZoom,
} from "../Zoom/Zoom";
import { generateId } from "../../utils/idGenerator";
import { usePointerPosition } from "../Shape/usePointerPosition"; // Adjust the path as needed
import { LayerContext } from "../Layer/LayerProvider"; // Import LayerContext
import { useLayerContext } from "../Layer/useLayerContext"; // Adjust path as needed

interface CanvasProps {
  backgroundColor: string;
  opacity: number;
  width: string;
  height: string;
  onZoomChange: (zoomLevel: number) => void;
  selectedShape: "rect" | "ellipse" | "line" | null;
}

export interface CanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomToPercentage: (percentage: number) => void;
  getStage: () => Konva.Stage | null;
}

interface Shape {
  id: string;
  type: "rect" | "ellipse" | "line";
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  layerId: string;
}

const Canvas = React.forwardRef<CanvasRef, CanvasProps>((props, ref) => {
  const { width, height, onZoomChange, selectedShape } = props;

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const getPointerPosition = usePointerPosition(stageRef);

  const { layers, addLayer, toggleVisibility } = useLayerContext(); // Use the custom hook
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false); // State for drawing
  const [isPanning, setIsPanning] = useState(false); // State for panning

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

  const handleMouseDown = () => {
    if (isPanning) {
      const stage = stageRef.current;
      if (stage) {
        stage.startDrag(); // Start panning
      }
      return;
    }

    if (!selectedShape || selectedShape === "select") return;

    setIsDrawing(true); // Set drawing state to true

    const pointerPos = getPointerPosition();

    const id = generateId();
    const layerId = generateId();
    addLayer(selectedShape, layerId);

    const newShape: Shape = {
      id: `shape-${id}`,
      type: selectedShape,
      x: pointerPos.x,
      y: pointerPos.y,
      fill: "transparent",
      stroke: "blue",
      strokeWidth: 1,
      layerId, // Associate the shape with the newly created layer
    };

    if (selectedShape === "line") {
      newShape.points = [
        pointerPos.x,
        pointerPos.y,
        pointerPos.x,
        pointerPos.y,
      ];
    } else {
      newShape.width = 0;
      newShape.height = 0;
    }

    setDrawingShape(newShape);
    setSelectedShapeId(null);
  };

  const handleMouseMove = () => {
    if (isPanning) return; // Skip shape movement during panning

    if (!drawingShape) return;

    const pointerPos = getPointerPosition();

    setDrawingShape((prev) => {
      if (!prev) return null;

      if (prev.type === "rect" || prev.type === "ellipse") {
        return {
          ...prev,
          width: pointerPos.x - prev.x,
          height: pointerPos.y - prev.y,
        };
      } else if (prev.type === "line") {
        return {
          ...prev,
          points: [prev.x, prev.y, pointerPos.x, pointerPos.y],
        };
      }

      return prev;
    });
  };

  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const handleMouseUp = () => {
    if (isPanning) return; // Skip ending drawing during panning

    if (drawingShape) {
      const MIN_SIZE = 5; // Minimum size for shapes
      if (drawingShape.type === "rect" || drawingShape.type === "ellipse") {
        const { width = 0, height = 0 } = drawingShape;
        if (Math.abs(width) < MIN_SIZE || Math.abs(height) < MIN_SIZE) {
          setDrawingShape(null);
          setIsDrawing(false);
          return; // Discard the shape
        }
      } else if (drawingShape.type === "line") {
        const [x1, y1, x2, y2] = drawingShape.points || [0, 0, 0, 0];
        if (calculateDistance(x1, y1, x2, y2) < MIN_SIZE) {
          setDrawingShape(null);
          setIsDrawing(false);
          return; // Discard the shape
        }
      }

      setShapes((prevShapes) => [...prevShapes, drawingShape]);
      setSelectedShapeId(drawingShape.id);
      setDrawingShape(null);
    }
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
      draggable: !isDrawing && !isPanning, // Disable dragging while drawing or panning
      strokeScaleEnabled: false,
      onClick: () => setSelectedShapeId(shape.id),
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
      draggable={isPanning} // Enable canvas panning when spacebar is pressed
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
