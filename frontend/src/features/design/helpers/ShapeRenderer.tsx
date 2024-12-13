import React from "react";
import { Rect, Ellipse, Line, RegularPolygon, Text, Image } from "react-konva";
import { Shape } from "./Shape";
import Konva from "konva";

interface ShapeRendererProps {
  shape: Shape;
  isDrawing: boolean;
  isPanning: boolean;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleDragEnd: (id: string, x: number, y: number) => void;
  handleDoubleClick: (id: string) => void;
  selectedShape: string | null;
  selected: boolean;
  onClick?: () => void;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shape,
  isDrawing,
  isPanning,
  setShapes,
  setSelectedShapeId,
  setSelectedLayerIds,
  handleDragEnd,
  handleDoubleClick,
  selected,
}) => {
  const { id, type, layerId, ...restProps } = shape;

  const commonProps = {
    id,
    layerId,
    draggable: !isDrawing && !isPanning,
    strokeScaleEnabled: false,
    listening: selected, // Use `selected` to determine interaction
    onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => {
      const { x, y } = e.target.position();
      setShapes((prevShapes) =>
        prevShapes.map((s) => (s.id === id ? { ...s, x, y } : s))
      );
    },
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      const { x, y } = e.target.position();
      handleDragEnd(id, x, y);
    },
    onClick: selected
      ? () => {
          setSelectedShapeId(layerId); // Use `layerId` instead of `id`
          setSelectedLayerIds([layerId]); // Set the selected `layerId`
        }
      : undefined,
  };

  // Render based on shape type
  switch (type) {
    case "rect":
      return (
        <Rect
          key={id}
          {...commonProps}
          {...restProps}
          width={shape.width || 0}
          height={shape.height || 0}
        />
      );

    case "ellipse":
      return (
        <Ellipse
          key={id}
          {...commonProps}
          {...restProps}
          radiusX={(shape.width || 0) / 2}
          radiusY={(shape.height || 0) / 2}
        />
      );

    case "hexagon":
      return (
        <RegularPolygon
          key={id}
          {...commonProps}
          {...restProps}
          radius={shape.radius || 0}
          sides={shape.sides || 6}
        />
      );

    case "line":
      return (
        <Line
          key={id}
          {...commonProps}
          points={shape.points || []}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
        />
      );

    case "pen":
      return (
        <Line
          key={id}
          {...commonProps}
          points={shape.points || []}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          tension={shape.tension}
        />
      );

    case "text":
      return (
        <Text
          key={id}
          {...commonProps}
          {...restProps}
          text={shape.text || ""}
          fontSize={shape.fontSize || 14}
          fontFamily={shape.fontFamily || "Arial"}
          onDblClick={() => handleDoubleClick(id)}
        />
      );

    case "image":
      return (
        <Image
          key={id}
          {...commonProps}
          x={shape.x || 0}
          y={shape.y || 0}
          image={shape.image}
          width={shape.width || 0}
          height={shape.height || 0}
        />
      );

    case "area":
      return (
        <Rect
          key={id}
          {...commonProps}
          {...restProps}
          width={shape.width || 0}
          height={shape.height || 0}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
        />
      );

    default:
      return null;
  }
};

export default ShapeRenderer;
