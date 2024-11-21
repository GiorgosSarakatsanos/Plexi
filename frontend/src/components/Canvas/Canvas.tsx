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
  const groupTransformerRef = useRef<Konva.Transformer>(null);

  const getPointerPosition = usePointerPosition(stageRef);

  const { addLayer, setSelectedLayerIds } = useLayerContext();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Function to select a shape by ID
  const selectShapeById = (shapeId: string) => {
    const shape = shapes.find((s) => s.id === shapeId);
    if (shape) {
      setSelectedShapeId(shape.id);
      setSelectedLayerIds([shape.layerId]);
      setSelectedGroupId(null); // Deselect group if a shape is selected
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

  const [drawingGroups, setDrawingGroups] = useState<
    { groupId: string; shapes: Shape[]; rect: Shape }[]
  >([]);

  useEffect(() => {
    const transformer = transformerRef.current;
    const groupTransformer = groupTransformerRef.current;
    const stage = stageRef.current;

    if (!stage) return;

    if (selectedGroupId) {
      const group = stage.findOne(`#${selectedGroupId}`);
      if (group && groupTransformer) {
        groupTransformer.nodes([group]);
        groupTransformer.getLayer()?.batchDraw();
      }
    } else if (selectedShapeId) {
      const shape = stage.findOne(`#${selectedShapeId}`);
      if (shape && transformer) {
        transformer.nodes([shape]);
        transformer.getLayer()?.batchDraw();
      }
    } else {
      // Deselect both transformers
      if (transformer) transformer.nodes([]);
      if (groupTransformer) groupTransformer.nodes([]);
    }
  }, [selectedShapeId, selectedGroupId, shapes]);

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
    if (isDrawing) {
      return; // Prevent creating multiple shapes at once
    }

    const stage = stageRef.current;

    if (!selectedShape || selectedShape === "select") {
      if (e.target === stage) {
        setSelectedShapeId(null);
        setSelectedGroupId(null);
        setSelectedLayerIds([]);

        const transformer = transformerRef.current;
        if (transformer) {
          transformer.nodes([]);
          transformer.getLayer()?.batchDraw();
        }

        const groupTransformer = groupTransformerRef.current;
        if (groupTransformer) {
          groupTransformer.nodes([]);
          groupTransformer.getLayer()?.batchDraw();
        }
      } else if (e.target?.hasName("group")) {
        setSelectedGroupId(e.target.id());
        setSelectedShapeId(null);
      }
      return;
    }

    const pointerPos = getPointerPosition();
    const activeGroup = drawingGroups.find(
      (group) =>
        pointerPos.x >= group.rect.x &&
        pointerPos.x <= group.rect.x + group.rect.width &&
        pointerPos.y >= group.rect.y &&
        pointerPos.y <= group.rect.y + group.rect.height
    );

    if (activeGroup) {
      console.log("Drawing inside group:", activeGroup.groupId);
    } else {
      console.log("Drawing on the stage (no group)");
    }

    // Handle creation of the drawing area itself
    if (selectedShape === "drawing-area") {
      const id = generateId();
      const layerId = generateId();
      const groupId = `group-${id}`;

      // Create a rectangle for the drawing area
      const newRect: Shape = {
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
      };

      // Create a new drawing group
      const newGroup = {
        groupId,
        shapes: [], // Shapes inside this group
        rect: newRect, // The rectangle representing the area
      };

      setDrawingGroups((prev) => [...prev, newGroup]);
      setDrawingShape(newRect);
      setIsDrawing(true);
      return;
    }

    // Create a new shape (e.g., line or rect)
    const id = generateId();
    const layerId = generateId();
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
        height: 1,
        fill: "transparent",
        stroke: "blue",
        strokeWidth: 1,
        layerId,
      };
    }

    if (selectedShape === "text") {
      newShape = {
        id: `shape-${id}`,
        type: "text",
        x: pointerPos.x,
        y: pointerPos.y,
        text: "Edit me", // Default text
        fill: "black",
        fontSize: 16,
        fontFamily: "Arial",
        stroke: "transparent",
        strokeWidth: 0,
        layerId,
      };
    }

    // Add the shape to the appropriate group or globally
    if (activeGroup) {
      setDrawingGroups((prev) =>
        prev.map((group) =>
          group.groupId === activeGroup.groupId
            ? { ...group, shapes: [...group.shapes, newShape] }
            : group
        )
      );
    } else {
      // Do not add the shape to `shapes` here
      setDrawingShape(newShape);
    }

    setDrawingShape(newShape);
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

    setDrawingGroups((prev) =>
      prev.map((group) =>
        group.rect.id === drawingShape.id
          ? {
              ...group,
              rect: {
                ...group.rect,
                width: drawingShape.width,
                height: drawingShape.height,
              },
            }
          : group
      )
    );
  };

  const handleMouseUp = () => {
    if (!drawingShape) return;

    // Finalize the drawing area if selectedShape is "drawing-area"
    if (selectedShape === "drawing-area") {
      setDrawingGroups((prev) =>
        prev.map((group) =>
          group.rect.id === drawingShape.id
            ? { ...group, rect: drawingShape }
            : group
        )
      );
      setDrawingShape(null);
      setIsDrawing(false);
      props.setSelectedShape("select");
      return;
    }

    const pointerPos = getPointerPosition();
    const activeGroup = drawingGroups.find(
      (group) =>
        pointerPos.x >= group.rect.x &&
        pointerPos.x <= group.rect.x + group.rect.width &&
        pointerPos.y >= group.rect.y &&
        pointerPos.y <= group.rect.y + group.rect.height
    );

    if (activeGroup) {
      setDrawingGroups((prev) =>
        prev.map((group) =>
          group.groupId === activeGroup.groupId
            ? { ...group, shapes: [...group.shapes, drawingShape] }
            : group
        )
      );
    } else {
      // Add the drawing shape to the shapes array
      setShapes((prevShapes) => [...prevShapes, drawingShape]);

      // Add a new layer for the drawing shape
      addLayer(drawingShape.type, drawingShape.layerId);

      // Set the transformer for the new shape
      setSelectedShapeId(drawingShape.id);
    }

    setDrawingShape(null);
    setIsDrawing(false);
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

    // Get the absolute position and scale of the text shape
    const shapePosition = currentShape.getAbsolutePosition();
    const shapeScale = currentShape.getAbsoluteScale();

    // Temporarily hide the text by reducing opacity
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              opacity: 0, // Make the text invisible
            }
          : shape
      )
    );

    // Create a contentEditable div overlay
    const div = document.createElement("div");
    div.contentEditable = "true";
    div.innerText = textShape.text || ""; // Set the current text
    div.style.position = "absolute";
    div.style.top = `${
      container.getBoundingClientRect().top +
      shapePosition.y -
      textShape.fontSize! * shapeScale.y * 0.5
    }px`;
    div.style.left = `${
      container.getBoundingClientRect().left + shapePosition.x
    }px`;
    div.style.width = `${(textShape.width || 200) * shapeScale.x}px`; // Set div width to match the text
    div.style.height = `${textShape.fontSize! * shapeScale.y * 1.2}px`; // Set height based on font size
    div.style.fontSize = `${textShape.fontSize! * shapeScale.y}px`;
    div.style.fontFamily = textShape.fontFamily || "Arial";
    div.style.color = "black";
    div.style.background = "transparent";
    div.style.outline = "none";
    div.style.border = "none";
    div.style.padding = "0";
    div.style.margin = "0";
    div.style.resize = "none";
    div.style.zIndex = "1000";
    div.style.cursor = "text";

    // Append the div to the document body
    document.body.appendChild(div);
    div.focus();

    // Save changes on blur or Enter key press
    const saveChanges = () => {
      const newText = div.innerText.trim();

      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === shapeId
            ? {
                ...shape,
                text: newText || "Double-click to edit", // Save edited text
                opacity: 1, // Restore opacity
              }
            : shape
        )
      );

      // Clean up the div
      document.body.removeChild(div);
    };

    div.addEventListener("blur", saveChanges);
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveChanges();
      }
    });
  };

  const renderGroup = (group: {
    groupId: string;
    shapes: Shape[];
    rect: Shape;
  }) => {
    return (
      <Group
        key={group.groupId}
        id={group.groupId}
        draggable
        onDragMove={(e) => {
          const { x, y } = e.target.position();
          setDrawingGroups((prev) =>
            prev.map((g) =>
              g.groupId === group.groupId
                ? {
                    ...g,
                    rect: { ...g.rect, x, y },
                    shapes: g.shapes.map((shape) => ({
                      ...shape,
                      x: shape.x + (x - g.rect.x),
                      y: shape.y + (y - g.rect.y),
                    })),
                  }
                : g
            )
          );
        }}
      >
        {/* Render the rectangle for the drawing area */}
        {renderShape(group.rect)}
        {/* Render the shapes inside the group */}
        {group.shapes.map((shape) => renderShape(shape))}
      </Group>
    );
  };

  const renderShape = (shape: Shape) => {
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
        setShapes((prevShapes) =>
          prevShapes.map((s) => (s.id === id ? { ...s, x, y } : s))
        );
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
            key={id} // Pass key explicitly
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
          {drawingGroups.map(renderGroup)}
          {shapes.map(renderShape)}
          {drawingShape && renderShape(drawingShape)}
          <Transformer ref={transformerRef} />
          <Transformer ref={groupTransformerRef} />
        </Layer>
      </Stage>
    </>
  );
});

export default Canvas;
