import React, { useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeRenderer from "../Shape/ShapeRenderer";
import MarginLines from "../MarginLines/MarginLines";
import { marginSettings } from "../MarginLines/MarginSettings";
import useKonvaMouseEvents from "../Shape/useKonvaMouseEvents";
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

  // Shape management hook
  const { shapes, selectedShapeId, addShape, selectShapeById } =
    useShapeManagement();

  // Konva mouse events hook
  const { handleMouseDown, handleMouseMove, handleMouseUp, currentShape } =
    useKonvaMouseEvents(selectedShape, addShape, selectShapeById, stageRef);

  // Sync transformer with selected shape
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

  return (
    <div>
      <Stage
        width={width}
        height={height}
        style={{ backgroundColor }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {/* Render shapes and apply transformer for selected shapes */}
          <ShapeRenderer
            shapes={shapes}
            currentShape={currentShape}
            selectedShapeId={selectedShapeId}
          />
          <Transformer ref={transformerRef} />
        </Layer>

        {/* Render margin lines if enabled */}
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
