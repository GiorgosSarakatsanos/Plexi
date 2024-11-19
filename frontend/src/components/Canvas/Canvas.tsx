import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import {
  Stage,
  Layer,
  Transformer,
  Rect,
  Ellipse,
  Line,
  RegularPolygon,
  Text,
  Image,
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
import { SelectedShape, DrawableShape } from "../Shape/ToolTypes";

interface CanvasProps {
  backgroundColor: string;
  opacity: number;
  width: string;
  height: string;
  onZoomChange: (zoomLevel: number) => void;
  selectedShape: SelectedShape;
  setSelectedShape: React.Dispatch<React.SetStateAction<SelectedShape>>; // Add this
}

export interface CanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomToPercentage: (percentage: number) => void;
  getStage: () => Konva.Stage | null;
  selectShapeById: (shapeId: string) => void; // Add this line
  handleUploadImage: () => void; // Add this
}

interface Shape {
  id: string;
  type: DrawableShape;
  x: number;
  y: number;
  text?: string; // For text elements
  width?: number;
  height?: number;
  points?: number[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  layerId: string;
  fontSize?: number; // Text-specific properties
  fontFamily?: string;
  radius?: number; // For hexagon
  image?: HTMLImageElement; // Add this for image shapes
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
    handleUploadImage: () => {
      fileInputRef.current?.click(); // Trigger the file input
    }, // Add this method to the return object
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
      transformer.nodes([]); // Deselect transformer if no node is found
    }
  }, [selectedShapeId, shapes]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const image = new window.Image();
          image.src = reader.result as string;
          image.onload = () => {
            // Add image to shapes
            const id = generateId();
            const layerId = generateId();
            const newImage: Shape = {
              id: `shape-${id}`,
              type: "image",
              x: 100,
              y: 100,
              width: image.width,
              height: image.height,
              layerId,
              fill: "transparent",
              stroke: "transparent",
              strokeWidth: 0,
              image, // Store the image element
            };
            props.setSelectedShape("select"); // Automatically switch back to select
            setShapes((prevShapes) => [...prevShapes, newImage]);
            setSelectedShapeId(newImage.id);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click(); // Trigger file input click
  };

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
    selectShapeById: (shapeId: string) => {
      const shape = shapes.find((s) => s.id === shapeId);
      if (shape) {
        setSelectedShapeId(shape.id);
      }
    },
    handleUploadImage, // Expose this function to parent component
  }));

  const handleMouseDown = () => {
    if (!selectedShape || selectedShape === "select") {
      return; // Ignore non-drawable tools
    }
    if (selectedShape === "image") {
      fileInputRef.current?.click(); // Open the file dialog
      return; // Stop further drawing logic
    }

    const pointerPos = getPointerPosition();
    const id = generateId();
    const layerId = generateId();

    if (selectedShape === "text") {
      // Create a text shape
      const newText: Shape = {
        id: `shape-${id}`,
        type: "text",
        x: pointerPos.x,
        y: pointerPos.y,
        text: "Double-click to edit",
        fill: "black",
        stroke: "transparent",
        strokeWidth: 1,
        fontSize: 16,
        fontFamily: "Arial",
        layerId,
      };
      addLayer("text", layerId); // Add the text layer

      // Add the text shape and immediately select it
      setShapes((prevShapes) => [...prevShapes, newText]);
      setSelectedShapeId(newText.id); // Set the text shape as selected
      setSelectedLayerIds([newText.layerId]); // Highlight its layer
      return;
    }

    // Handle other shapes
    let newShape: Shape;

    if (selectedShape === "line") {
      newShape = {
        id: `shape-${id}`,
        type: "line",
        x: 0,
        y: 0,
        points: [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y],
        fill: "transparent",
        stroke: "blue",
        strokeWidth: 1,
        layerId,
      };
    } else {
      newShape = {
        id: `shape-${id}`,
        type: selectedShape,
        x: pointerPos.x,
        y: pointerPos.y,
        width: 0,
        height: 0,
        fill: "transparent",
        stroke: "blue",
        strokeWidth: 1,
        layerId,
      };
    }

    addLayer(selectedShape, layerId); // Add the layer for other shapes
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

    // Automatically switch back to the "select" tool
    props.setSelectedShape("select");
  };

  const handleDoubleClick = (shapeId: string) => {
    const textShape = shapes.find(
      (shape) => shape.id === shapeId && shape.type === "text"
    );
    if (!textShape) return;

    const stage = stageRef.current;
    if (!stage) return;

    const container = stage.container();
    const scale = stage.scaleX(); // Assuming uniform scaling

    // Find the shape in the stage and get its absolute position and scale
    const currentShape = stage.findOne(`#${shapeId}`);
    if (!currentShape) return;

    const shapePosition = currentShape.getAbsolutePosition();
    const shapeScale = currentShape.scale() || { x: 1, y: 1 }; // Fallback to {x: 1, y: 1}

    // Temporarily hide the text on the canvas
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              fill: "transparent", // Make the text transparent
            }
          : shape
      )
    );

    // Create an input field
    const input = document.createElement("input");
    input.type = "text";
    input.value = textShape.text || "";
    input.style.position = "absolute";

    // Adjust position based on canvas transformations and text alignment
    const containerRect = container.getBoundingClientRect();
    input.style.top = `${
      containerRect.top +
      shapePosition.y * scale -
      (textShape.fontSize! * shapeScale.y) / 2
    }px`;
    input.style.left = `${containerRect.left + shapePosition.x * scale}px`;

    // Style the input to match the text
    input.style.fontSize = `${textShape.fontSize! * shapeScale.y}px`; // Account for scaling
    input.style.fontFamily = textShape.fontFamily || "Arial";
    input.style.color = textShape.fill;
    input.style.border = "none";
    input.style.background = "transparent";
    input.style.outline = "none";
    input.style.padding = "0";
    input.style.margin = "0";
    input.style.zIndex = "1000";

    // Append the input to the document body
    document.body.appendChild(input);
    input.focus();

    // Restore the text and save changes when the input loses focus
    input.addEventListener("blur", () => {
      const newText = input.value;
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

      // Apply the original scale back to the text shape
      const updatedShape = stage.findOne(`#${shapeId}`);
      if (updatedShape) {
        updatedShape.scale(shapeScale); // Restore the scale
      }

      document.body.removeChild(input); // Clean up the input field
    });
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
          : undefined,
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
      case "text":
        return (
          <Text
            {...commonProps}
            text={shape.text || ""}
            fontSize={shape.fontSize}
            fontFamily={shape.fontFamily}
            onDblClick={() => handleDoubleClick(shape.id)}
          />
        );
      case "image":
        return (
          <Image
            {...commonProps}
            image={shape.image} // The HTMLImageElement
            width={shape.width}
            height={shape.height}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
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
    </>
  );
});

export default Canvas;
