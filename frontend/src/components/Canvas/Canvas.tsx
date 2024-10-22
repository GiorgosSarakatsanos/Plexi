import React, { useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import ShapeFactory from "../Shape/ShapeFactory";
import MarginLines from "../MarginLines/MarginLines";
import { marginSettings } from "../MarginLines/MarginSettings";
import { useKonvaMouseEvents } from "../../hooks/useKonvaMouseEvents";
import { useLayerContext } from "../Layer/useLayerContext";
import Konva from "konva";

// Define the Shape interface
interface Shape {
  id: number;
  type: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[]; // For shapes like triangle or line
}

interface CanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
  selectedShape: string | null;
  showMarginLines: boolean;
  margins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor,
  selectedShape,
  showMarginLines,
  margins,
}) => {
  const stageRef = useRef<Konva.Stage>(null); // Add reference to the stage
  const [shapes, setShapes] = useState<Shape[]>([]); // Define shapes with proper type
  const { addLayer } = useLayerContext(); // Use the layer context

  const { handleMouseDown, handleMouseMove, handleMouseUp, currentShape } =
    useKonvaMouseEvents(
      selectedShape,
      (newShape: Shape) => {
        setShapes((prevShapes) => [...prevShapes, newShape]);
        addLayer({
          id: newShape.id,
          name: `Layer ${newShape.type} ${newShape.id}`, // Create a name for the shape
          type: newShape.type,
        });
      },
      stageRef
    ); // Pass stageRef to useKonvaMouseEvents

  return (
    <div>
      <Stage
        width={width}
        height={height}
        style={{ backgroundColor }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef} // Assign the reference
      >
        <Layer>
          {shapes.map((shape) => (
            <ShapeFactory key={shape.id} shapeType={shape.type} {...shape} />
          ))}

          {currentShape && (
            <ShapeFactory
              shapeType={currentShape.type}
              position={currentShape.position}
              width={currentShape.width}
              height={currentShape.height}
              radiusX={currentShape.radiusX}
              radiusY={currentShape.radiusY}
              points={currentShape.points} // Ensure points are passed for live rendering
            />
          )}
        </Layer>

        {showMarginLines && (
          <Layer>
            <MarginLines
              width={width}
              height={height}
              topMargin={parseInt(margins.top, 10)}
              rightMargin={parseInt(margins.right, 10)}
              bottomMargin={parseInt(margins.bottom, 10)}
              leftMargin={parseInt(margins.left, 10)}
              marginColor={marginSettings.marginColor}
              lineStyle={marginSettings.lineStyle}
              dashPattern={marginSettings.dashPattern}
              opacity={marginSettings.opacity}
              visible={showMarginLines}
            />
          </Layer>
        )}
      </Stage>
    </div>
  );
};

export default Canvas;
