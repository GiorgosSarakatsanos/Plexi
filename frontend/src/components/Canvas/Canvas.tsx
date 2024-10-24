import React, { useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeFactory from "../Shape/ShapeFactory";
import MarginLines from "../MarginLines/MarginLines";
import { marginSettings } from "../MarginLines/MarginSettings";
import { useKonvaMouseEvents } from "../Shape/useKonvaMouseEvents";
import { useShapeManagement } from "../Shape/useShapeManagement";
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

  const { shapes, selectedShapeId, addShape, selectShapeById } =
    useShapeManagement();

  const { handleMouseDown, handleMouseMove, handleMouseUp, currentShape } =
    useKonvaMouseEvents(selectedShape, addShape, selectShapeById);

  useEffect(() => {
    const transformer = transformerRef.current;
    const selectedNode = stageRef.current?.findOne(`#shape-${selectedShapeId}`);

    if (selectedNode && transformer) {
      transformer.nodes([selectedNode]);
      transformer.getLayer()?.batchDraw();
    } else if (transformer) {
      transformer.nodes([]);
    }
  }, [selectedShapeId, shapes]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnShapeId = e.target?.attrs?.id;

    if (selectedShape === "select") {
      if (clickedOnShapeId) {
        selectShapeById(parseInt(clickedOnShapeId.replace("shape-", "")));
      } else {
        selectShapeById(null); // Deselect if clicking on an empty area
      }
    } else {
      handleMouseDown(e); // Handle drawing the shape
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
          {/* Render the finalized shapes */}
          {shapes.map((shape) => (
            <ShapeFactory
              key={shape.id}
              shapeType={shape.type}
              isSelected={shape.id === selectedShapeId}
              {...shape}
              id={shape.id}
            />
          ))}

          {/* Render the live shape while drawing */}
          {currentShape && (
            <ShapeFactory
              key={"temp-shape"}
              shapeType={currentShape.type}
              {...currentShape}
              id={currentShape.id}
            />
          )}

          <Transformer ref={transformerRef} />
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
