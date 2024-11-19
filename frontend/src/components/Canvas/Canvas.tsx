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
import DrawingArea from "./DrawingArea";

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
  const [drawingArea, setDrawingArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [drawingAreas, setDrawingAreas] = useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  // Function to select a shape by ID
  const selectShapeById = (shapeId: string) => {
    const drawingShape = shapes.find((s) => s.id === shapeId);
    if (drawingShape) {
      setShapes((prevShapes) => [...prevShapes, drawingShape]);
      setSelectedShapeId(drawingShape.id); // Select the created shape
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

    if (!transformer || !stage) return;

    if (selectedShapeId) {
      // Find the currently selected shape
      const selectedNode = stage.findOne(`#${selectedShapeId}`);
      if (selectedNode) {
        // Attach the transformer to the selected shape
        transformer.nodes([selectedNode]);
        transformer.getLayer()?.batchDraw();
      } else {
        // Deselect transformer if no node is found
        transformer.nodes([]);
        transformer.getLayer()?.batchDraw();
      }
    } else {
      // Deselect transformer
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedShapeId, shapes]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    // Check if clicked on an empty area
    if (e.target === stage) {
      // Deselect shape
      setSelectedShapeId(null);

      // Disable dragging for all shapes
      setShapes((prevShapes) =>
        prevShapes.map((shape) => ({
          ...shape,
          draggable: false,
        }))
      );
    }
  };

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
            // Calculate new dimensions to maintain aspect ratio
            const targetHeight = 300;
            const aspectRatio = image.width / image.height;
            const targetWidth = targetHeight * aspectRatio;

            // Add the scaled image to shapes
            const id = generateId();
            const layerId = generateId();
            const newImage: Shape = {
              id: `shape-${id}`,
              type: "image",
              x: 100,
              y: 100,
              width: targetWidth,
              height: targetHeight,
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

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;

    if (!selectedShape || selectedShape === "select") {
      if (e.target === stage) {
        console.log("Clicked on empty stage");
        setSelectedShapeId(null);
        setSelectedLayerIds([]);
        const transformer = transformerRef.current;
        if (transformer) {
          transformer.nodes([]);
          transformer.getLayer()?.batchDraw();
        }
      }
      return;
    }

    if (selectedShape === "drawing-area") {
      const pointerPos = stageRef.current?.getPointerPosition();
      if (pointerPos) {
        setDrawingArea({
          x: pointerPos.x,
          y: pointerPos.y,
          width: 0,
          height: 0,
        });
      }
      return;
    }

    if (selectedShape === "image") {
      fileInputRef.current?.click(); // Open the file dialog
      return; // Stop further drawing logic
    }

    const pointerPos = getPointerPosition();
    const id = generateId();
    const layerId = generateId();

    if (selectedShape === "text") {
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
      addLayer("text", layerId);

      setShapes((prevShapes) => [...prevShapes, newText]);
      setSelectedShapeId(newText.id);
      setSelectedLayerIds([newText.layerId]);
      return;
    }

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

    addLayer(selectedShape, layerId);
    setDrawingShape(newShape);
    setSelectedLayerIds([layerId]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectedShape === "drawing-area" && drawingArea) {
      const pointerPos = e.target.getStage()?.getPointerPosition();
      if (pointerPos) {
        setDrawingArea((prev) =>
          prev
            ? {
                ...prev,
                width: pointerPos.x - prev.x,
                height: pointerPos.y - prev.y,
              }
            : null
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (selectedShape === "drawing-area" && drawingArea) {
      setDrawingAreas((prev) => [...prev, drawingArea]); // Persist the drawing area
      setDrawingArea(null); // Clear the temporary drawing area
      props.setSelectedShape("select"); // Reset to select tool
      return;
    }

    if (drawingShape) {
      setShapes((prevShapes) => [...prevShapes, drawingShape]);
      setSelectedShapeId(drawingShape.id); // Select the created shape
      setDrawingShape(null);
      setIsDrawing(false);

      // Automatically switch back to the "select" tool
      props.setSelectedShape("select");
    }
  };

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
              fill: "transparent", // Make the text transparent
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
        onMouseDown={(e) => {
          handleStageClick(e); // Detect clicks on empty space
          handleMouseDown(e); // Existing logic for creating shapes
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        draggable={isPanning}
        ref={stageRef}
      >
        {/* Render all drawing areas */}
        {drawingAreas.map((area, index) => (
          <Layer key={`layer-${index}`}>
            <DrawingArea
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              scale={stageRef.current?.scaleX() || 1}
              onDeselect={() => setSelectedShapeId(null)} // Clear selection on canvas click
            />
          </Layer>
        ))}

        {/* Render the current drawing area */}
        {/* Render the current drawing area */}
        {drawingArea && (
          <Layer key="drawing-area-layer">
            <Rect
              x={drawingArea.x}
              y={drawingArea.y}
              width={drawingArea.width}
              height={drawingArea.height}
              fill="rgba(0, 0, 255, 0.1)" // Light background for visibility
              stroke="blue"
              strokeWidth={1}
              dash={[10, 10]} // Dashed border for better UX
            />
          </Layer>
        )}

        {/* Main layer for other shapes */}
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
