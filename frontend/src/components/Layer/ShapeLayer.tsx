import React, { useEffect } from "react";
import Konva from "konva";
import { Layer, Transformer } from "react-konva";
import ShapeFactory from "../Shape/ShapeFactory";
import { useShapeManagement } from "../Shape/useShapeManagement";

interface ShapeLayerProps {
  selectedShapeId: number | null;
  transformerRef: React.RefObject<Konva.Transformer>;
}

const ShapeLayer: React.FC<ShapeLayerProps> = ({
  selectedShapeId,
  transformerRef,
}) => {
  const { shapes } = useShapeManagement();

  // Log the shapes array to verify re-renders
  useEffect(() => {
    console.log("ShapeLayer re-rendered with shapes: ", shapes);
  }, [shapes]); // Re-run this effect whenever `shapes` changes

  return (
    <Layer>
      {shapes.map((shape) => (
        <ShapeFactory
          key={shape.id}
          shapeType={shape.type}
          isSelected={shape.id === selectedShapeId}
          {...shape} // Ensure all properties are spread correctly
        />
      ))}
      <Transformer ref={transformerRef} />{" "}
      {/* Keep it to attach to selected shapes */}
    </Layer>
  );
};

export default ShapeLayer;
