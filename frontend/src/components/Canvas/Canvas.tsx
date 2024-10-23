import React, { useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeFactory from "../Shape/ShapeFactory";
import MarginLines from "../MarginLines/MarginLines";
import { marginSettings } from "../MarginLines/MarginSettings";
import { useKonvaMouseEvents } from "../Shape/useKonvaMouseEvents";
import { useLayerContext } from "../Layer/useLayerContext";
import { useShapeManagement } from "../Shape/useShapeManagement";
import { Shape } from "../Shape/ShapeProps";
import Konva from "konva";

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
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { addLayer } = useLayerContext();
  const { shapes, selectedShapeId, addShape, selectShapeById } =
    useShapeManagement();

  // Handle drawing and selection
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentShape, // Track current shape being drawn
  } = useKonvaMouseEvents(selectedShape, (newShape: Shape) => {
    addShape(newShape, addLayer);
  });

  // Re-attach transformer when a shape is selected or re-selected
  useEffect(() => {
    const transformer = transformerRef.current;

    // Find the selected shape on the stage
    const selectedNode = stageRef.current?.findOne(`#shape-${selectedShapeId}`);

    if (selectedNode && transformer) {
      transformer.nodes([selectedNode]);
      transformer.getLayer()?.batchDraw(); // Redraw the layer to show the Transformer
    } else if (transformer) {
      transformer.nodes([]); // Clear transformer if no node is selected
    }
  }, [selectedShapeId, shapes]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnShapeId = e.target?.attrs?.id;

    if (selectedShape === "select") {
      // If the select tool is active, select the shape
      if (clickedOnShapeId) {
        selectShapeById(parseInt(clickedOnShapeId.replace("shape-", ""))); // Ensure ID is passed correctly
      } else {
        selectShapeById(null); // Deselect all shapes if clicking on empty space
      }
    } else {
      // If not select tool, handle drawing
      handleMouseDown(e);
    }
  };

  return (
    <div>
      <Stage
        width={width}
        height={height}
        style={{ backgroundColor }}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {/* Render the shapes */}
          {shapes.map((shape) => (
            <ShapeFactory
              key={shape.id}
              shapeType={shape.type}
              isSelected={shape.id === selectedShapeId} // Mark as selected
              {...shape}
              id={shape.id} // Pass the shape's ID for selection
            />
          ))}

          {/* Render the current shape being drawn */}
          {currentShape && (
            <ShapeFactory
              key={"temp-shape"}
              shapeType={currentShape.type}
              {...currentShape}
              id={currentShape.id}
            />
          )}

          {/* Attach Transformer to selected shape */}
          <Transformer ref={transformerRef} />
        </Layer>

        {/* Optional: Margin lines */}
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
