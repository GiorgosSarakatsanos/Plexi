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
  Group,
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
  text?: string;
  width?: number;
  height?: number;
  points?: number[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  layerId: string;
  fontSize?: number;
  fontFamily?: string;
  radius?: number;
  image?: HTMLImageElement;
  groupId?: string; // Add this for grouping
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
  const [groups, setGroups] = useState<{ id: string; shapes: Shape[] }[]>([]);

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
        setSelectedShapeId(null); // Deselect all shapes
        setSelectedLayerIds([]); // Clear layer selection

        // Reset the Transformer
        const transformer = transformerRef.current;
        if (transformer) {
          transformer.nodes([]); // Clear all nodes from the Transformer
          transformer.getLayer()?.batchDraw();
        }
      }
      return;
    }

    const pointerPos = getPointerPosition();

    if (selectedShape === "drawing-area") {
      const groupId = generateId();
      const id = generateId();
      const layerId = generateId();

      const newGroup = {
        id: groupId,
        shapes: [],
      };

      setGroups((prevGroups) => [...prevGroups, newGroup]);

      // Create a new layer for the drawing area
      const newDrawingAreaLayer = new Konva.Layer({ id: layerId });
      stage?.add(newDrawingAreaLayer);

      // Create a rectangle as the drawing area
      const newDrawingArea: Shape = {
        id: `shape-${id}`,
        type: "rect",
        x: pointerPos.x,
        y: pointerPos.y,
        width: 0,
        height: 0,
        fill: "white",
        stroke: "lightgray",
        strokeWidth: 1,
        layerId,
        groupId,
      };

      // Add the layer to the state and set the new drawing shape
      addLayer("drawingArea", layerId);
      setDrawingShape(newDrawingArea);
      setIsDrawing(true);

      return;
    }

    if (selectedShape === "image") {
      fileInputRef.current?.click(); // Open the file dialog
      return; // Stop further drawing logic
    }

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

    const group = groups.find((group) =>
      group.shapes.some(
        (shape) =>
          shape.type === "rect" &&
          pointerPos.x >= shape.x &&
          pointerPos.x <= shape.x + (shape.width || 0) &&
          pointerPos.y >= shape.y &&
          pointerPos.y <= shape.y + (shape.height || 0)
      )
    );

    const groupId = group?.id || undefined;

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
        groupId,
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
        groupId,
      };
    }

    addLayer(selectedShape, layerId);
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

    if (drawingShape.groupId) {
      // Add the shape to its group
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === drawingShape.groupId
            ? { ...group, shapes: [...group.shapes, { ...drawingShape }] }
            : group
        )
      );
    } else {
      // Add the shape to standalone shapes if no groupId
      setShapes((prevShapes) => [...prevShapes, { ...drawingShape }]);
    }

    // Clear the drawingShape and reset state
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

  const renderGroup = (groupId: string, shapes: Shape[]) => {
    return (
      <Group
        key={groupId}
        draggable
        onDragMove={(e) => {
          const { x, y } = e.target.position();
          const group = groups.find((g) => g.id === groupId);

          if (group) {
            const dx = x - (group.shapes[0]?.x || 0); // Calculate delta movement
            const dy = y - (group.shapes[0]?.y || 0);

            setGroups((prevGroups) =>
              prevGroups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      shapes: g.shapes.map((shape) => ({
                        ...shape,
                        x: shape.x + dx,
                        y: shape.y + dy,
                      })),
                    }
                  : g
              )
            );
          }
        }}
      >
        {shapes.map(renderShape)}
      </Group>
    );
  };

  const renderShape = (shape: Shape) => {
    if (!shape) return null;

    const { id, type, ...restProps } = shape;

    const commonProps = {
      id,
      ...restProps,
      draggable: !isDrawing && !isPanning,
      strokeScaleEnabled: false,
      onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => {
        const { x, y } = e.target.position();
        setShapes((prevShapes) =>
          prevShapes.map((s) => (s.id === id ? { ...s, x, y } : s))
        );
      },
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
        const { x, y } = e.target.position();
        const shapeToMove = shapes.find((s) => s.id === id);

        if (!shapeToMove) return;

        // Check if the shape is inside any group (drawing area)
        const group = groups.find((group) =>
          group.shapes.some(
            (areaShape) =>
              areaShape.type === "rect" &&
              x >= areaShape.x &&
              x <= areaShape.x + (areaShape.width || 0) &&
              y >= areaShape.y &&
              y <= areaShape.y + (areaShape.height || 0)
          )
        );

        if (group) {
          // Add shape to the group if it's not already in it
          setGroups((prevGroups) =>
            prevGroups.map((g) =>
              g.id === group.id
                ? {
                    ...g,
                    shapes: [
                      ...g.shapes.filter((s) => s.id !== id),
                      shapeToMove,
                    ],
                  }
                : {
                    ...g,
                    shapes: g.shapes.filter((s) => s.id !== id), // Ensure it's removed from other groups
                  }
            )
          );
          // Update the shape's groupId
          setShapes((prevShapes) =>
            prevShapes.map((s) =>
              s.id === id ? { ...s, groupId: group.id } : s
            )
          );
        } else {
          // Remove shape from its group if dropped outside
          setGroups((prevGroups) =>
            prevGroups.map((g) => ({
              ...g,
              shapes: g.shapes.filter((s) => s.id !== id),
            }))
          );
          // Clear the shape's groupId
          setShapes((prevShapes) =>
            prevShapes.map((s) =>
              s.id === id ? { ...s, groupId: undefined } : s
            )
          );
        }
      },
      onClick:
        selectedShape === "select"
          ? () => {
              setSelectedShapeId(id);
              setSelectedLayerIds([shape.layerId]);
            }
          : undefined,
    };

    switch (type) {
      case "rect":
        return (
          <Rect
            key={id}
            {...commonProps}
            width={shape.width || 0}
            height={shape.height || 0}
          />
        );
      case "ellipse":
        return (
          <Ellipse
            key={id}
            {...commonProps}
            radiusX={(shape.width || 0) / 2}
            radiusY={(shape.height || 0) / 2}
          />
        );
      case "line":
        return <Line key={id} {...commonProps} points={shape.points || []} />;
      case "hexagon":
        return (
          <RegularPolygon
            key={id}
            {...commonProps}
            sides={6}
            radius={shape.radius || 0}
          />
        );
      case "text":
        return (
          <Text
            key={id}
            {...commonProps}
            text={shape.text || ""}
            fontSize={shape.fontSize}
            fontFamily={shape.fontFamily}
            onDblClick={() => handleDoubleClick(id)}
          />
        );
      case "image":
        return (
          <Image
            key={id}
            {...commonProps}
            image={shape.image}
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
          {groups.map((group) => renderGroup(group.id, group.shapes))}
          {shapes
            .filter((shape) => !shape.groupId) // Render only standalone shapes
            .map(renderShape)}
          {drawingShape && renderShape({ ...drawingShape })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </>
  );
});

export default Canvas;
