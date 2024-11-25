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

  const [imageHolder, setImageHolder] = useState<Shape | null>(null);
  const renderPreviewImage = () => {
    if (!previewImage || !isPreviewVisible) return null;

    const stage = stageRef.current;
    if (!stage) return null;

    // Get the current scale of the stage
    const scale = stage.scaleX(); // Assuming uniform scaling (scaleX === scaleY)
    const previewScreenHeight = 50; // Desired preview size in screen pixels
    const previewScreenWidth =
      previewScreenHeight * (previewImage.width / previewImage.height);

    // Adjust the size for zoom level
    const previewCanvasHeight = previewScreenHeight / scale;
    const previewCanvasWidth = previewScreenWidth / scale;

    // Calculate offset adjusted for scale
    const offsetCanvas = 10 / scale; // 10px screen offset converted to canvas coordinates

    return (
      <Image
        image={previewImage}
        x={previewPosition.x + offsetCanvas} // Apply scaled offset
        y={previewPosition.y + offsetCanvas} // Apply scaled offset
        width={previewCanvasWidth}
        height={previewCanvasHeight}
        opacity={0.5} // Semi-transparent
      />
    );
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

  const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(
    null
  );
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const image = new window.Image();
          image.src = reader.result as string;
          image.onload = () => {
            setPreviewImage(image);
            setIsPreviewVisible(true);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { setLayers } = useLayerContext();

  if (!setLayers) {
    throw new Error("setLayers is not defined in the LayerContext");
  }

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

    if (selectedShape === "area") {
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
      addLayer("area", layerId);
      setDrawingShape(newDrawingArea);
      setIsDrawing(true);

      console.log(`Created a new group with ID: ${groupId}`);
      return;
    }

    if (isPreviewVisible && previewImage) {
      setImageHolder({
        id: generateId(),
        type: "rect",
        x: pointerPos.x,
        y: pointerPos.y,
        width: 0,
        height: 0,
        fill: "rgba(0, 0, 0, 0.1)", // Placeholder fill
        stroke: "blue",
        strokeWidth: 1,
        layerId: generateId(),
      });
      setIsDrawing(true); // Start drawing the image holder
      return;
    }

    const id = generateId();
    const layerId = generateId();

    if (selectedShape === "text") {
      const pointerPos = getPointerPosition();

      // Find group based on pointer position
      const group = groups.find((group) =>
        group.shapes.some(
          (areaShape) =>
            areaShape.type === "rect" &&
            pointerPos.x >= areaShape.x &&
            pointerPos.x <= areaShape.x + (areaShape.width || 0) &&
            pointerPos.y >= areaShape.y &&
            pointerPos.y <= areaShape.y + (areaShape.height || 0)
        )
      );
      const groupId = group?.id || undefined;

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
        groupId, // Assign the groupId
      };

      if (groupId) {
        // Add text to group
        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g.id === groupId ? { ...g, shapes: [...g.shapes, newText] } : g
          )
        );
      }

      addLayer("text", layerId);
      setShapes((prevShapes) => [...prevShapes, newText]);
      setSelectedShapeId(newText.id);
      setSelectedLayerIds([newText.layerId]);

      props.setSelectedShape("select");
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

    setDrawingShape(newShape);
    setIsDrawing(true);

    props.setSelectedShape("select");

    console.log(
      `Created a new ${
        groupId ? "grouped" : "standalone"
      } shape with ID: ${id}, Group ID: ${groupId || "none"}`
    );
  };

  const handleMouseMove = () => {
    if (isDrawing && imageHolder) {
      // Update the dimensions of the image holder
      const pointerPos = getPointerPosition();
      setImageHolder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          width: pointerPos.x - prev.x,
          height: pointerPos.y - prev.y,
        };
      });
      return;
    }

    if (isDrawing && drawingShape) {
      const pointerPos = getPointerPosition();
      setDrawingShape((prev) => {
        if (!prev) return null;

        if (prev.type === "line") {
          const [startX, startY] = prev.points!;
          return {
            ...prev,
            points: [startX, startY, pointerPos.x, pointerPos.y],
          };
        } else if (prev.type === "hexagon") {
          // Calculate radius based on the distance from the initial point
          const radius = Math.sqrt(
            Math.pow(pointerPos.x - prev.x, 2) +
              Math.pow(pointerPos.y - prev.y, 2)
          );
          return {
            ...prev,
            radius,
          };
        }

        return {
          ...prev,
          width: pointerPos.x - prev.x,
          height: pointerPos.y - prev.y,
        };
      });
    }

    // Update the position of the preview image
    if (previewImage && isPreviewVisible) {
      const stage = stageRef.current;
      if (stage) {
        const pointerPos = stage.getPointerPosition();
        if (pointerPos) {
          const transform = stage.getAbsoluteTransform().copy();
          transform.invert();
          const transformedPos = transform.point(pointerPos);

          setPreviewPosition({ x: transformedPos.x, y: transformedPos.y });
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (!drawingShape && !imageHolder) return;

    // Finalize the image holder for preview images
    if (imageHolder && previewImage) {
      const { width = 0, height = 0, x, y } = imageHolder;

      if (Math.abs(width) < 5 || Math.abs(height) < 5) {
        setImageHolder(null);
        setIsDrawing(false);
        return;
      }

      const aspectRatio = previewImage.width / previewImage.height;
      const rectAspectRatio = Math.abs(width / height);

      let imageWidth, imageHeight;

      if (aspectRatio > rectAspectRatio) {
        imageWidth = Math.abs(width);
        imageHeight = imageWidth / aspectRatio;
      } else {
        imageHeight = Math.abs(height);
        imageWidth = imageHeight * aspectRatio;
      }

      const adjustedX = x + (Math.abs(width) - imageWidth) / 2;
      const adjustedY = y + (Math.abs(height) - imageHeight) / 2;

      const id = generateId();
      const layerId = generateId();

      const newImage: Shape = {
        id,
        type: "image",
        x: adjustedX,
        y: adjustedY,
        width: imageWidth,
        height: imageHeight,
        layerId,
        fill: "transparent",
        stroke: "transparent",
        strokeWidth: 0,
        image: previewImage,
      };

      setShapes((prevShapes) => [...prevShapes, newImage]);
      addLayer("image", newImage.id);

      setSelectedShapeId(id);

      // Reset image holder and preview
      setImageHolder(null);
      setPreviewImage(null);
      setIsPreviewVisible(false);
      setIsDrawing(false);
      return;
    }

    // Finalize drawing shapes (e.g., drawing area, polygons)
    if (drawingShape) {
      const newShape = { ...drawingShape };

      if (newShape.groupId) {
        // Add shape to its group
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === newShape.groupId
              ? { ...group, shapes: [...group.shapes, newShape] }
              : group
          )
        );
        addLayer(newShape.type, newShape.id, newShape.groupId); // Add to group layer
      } else {
        // Add standalone shapes
        setShapes((prevShapes) => [...prevShapes, newShape]);
        addLayer(newShape.type, newShape.id); // Add to standalone layer
      }

      // Automatically select the new shape and apply Transformer
      setSelectedShapeId(newShape.id);

      // Clear the drawing shape and reset the state
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

  const renderImageHolder = () => {
    if (!imageHolder) return null;
    return (
      <Rect
        x={imageHolder.x}
        y={imageHolder.y}
        width={imageHolder.width}
        height={imageHolder.height}
        fill={imageHolder.fill}
        stroke={imageHolder.stroke}
        strokeWidth={imageHolder.strokeWidth}
      />
    );
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

  const handleDragEnd = (shapeId: string, newX: number, newY: number) => {
    const shapeToMove = shapes.find((s) => s.id === shapeId);

    if (!shapeToMove) return;

    const group = groups.find((group) =>
      group.shapes.some(
        (areaShape) =>
          areaShape.type === "rect" &&
          newX >= areaShape.x &&
          newX <= areaShape.x + (areaShape.width || 0) &&
          newY >= areaShape.y &&
          newY <= areaShape.y + (areaShape.height || 0)
      )
    );

    if (group) {
      // Check if the shape is already in the group
      if (shapeToMove.groupId === group.id) return;

      // Add the shape to the group
      setGroups((prevGroups) =>
        prevGroups.map((g) =>
          g.id === group.id
            ? {
                ...g,
                shapes: [...g.shapes, shapeToMove],
              }
            : {
                ...g,
                shapes: g.shapes.filter((s) => s.id !== shapeId),
              }
        )
      );

      // Update the shape to belong to the group
      setShapes((prevShapes) =>
        prevShapes.map((s) =>
          s.id === shapeId ? { ...s, groupId: group.id } : s
        )
      );

      setLayers((prevLayers) =>
        prevLayers.map((layer) =>
          layer.id === shapeId
            ? { ...layer, isGrouped: true, groupId: group.id }
            : layer
        )
      );

      console.log(`Shape ${shapeId} moved to group ${group.id}`);
    } else {
      // Handle removing from a group (if applicable)
      if (shapeToMove.groupId) {
        setGroups((prevGroups) =>
          prevGroups.map((g) => ({
            ...g,
            shapes: g.shapes.filter((s) => s.id !== shapeId),
          }))
        );

        setShapes((prevShapes) =>
          prevShapes.map((s) =>
            s.id === shapeId ? { ...s, groupId: undefined } : s
          )
        );

        setLayers((prevLayers) =>
          prevLayers.map((layer) =>
            layer.id === shapeId
              ? { ...layer, isGrouped: false, groupId: undefined }
              : layer
          )
        );

        console.log(`Shape ${shapeId} removed from its group`);
      }
    }
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
        handleDragEnd(id, x, y); // Call the handleDragEnd function
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
        style={{
          cursor: isPreviewVisible ? "crosshair" : "default", // Change cursor dynamically
        }}
      >
        <Layer>
          {groups.map((group) => renderGroup(group.id, group.shapes))}
          {shapes
            .filter((shape) => !shape.groupId) // Render only standalone shapes
            .map(renderShape)}
          {drawingShape && renderShape({ ...drawingShape })}
          {renderPreviewImage()}
          {renderImageHolder()}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </>
  );
});

export default Canvas;
