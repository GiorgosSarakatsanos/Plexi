import React, { useRef, useEffect, useContext } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeRenderer from "../Shape/ShapeRenderer";
import MarginLines from "../MarginLines/MarginLines";
import { marginSettings } from "../MarginLines/MarginSettings";
import useKonvaMouseEvents from "../Shape/useKonvaMouseEvents";
import { useShapeManagement } from "../Shape/useShapeManagement";
import Konva from "konva";
import { LayerContext } from "../Layer/LayerContext";

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

  // Access LayerContext and add a type guard
  const layerContext = useContext(LayerContext);
  if (!layerContext) {
    throw new Error("Canvas must be wrapped in a LayerProvider");
  }
  const { selectedLayerId, setSelectedLayerId } = layerContext; // Use setSelectedLayerId for layer sync

  // Konva mouse events hook
  const { handleMouseDown, handleMouseMove, handleMouseUp, currentShape } =
    useKonvaMouseEvents(
      selectedShape,
      addShape,
      (id) => {
        selectShapeById(id);
        setSelectedLayerId(id); // Update layer context when selecting a shape on the canvas
      },
      stageRef
    );

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

  // Sync selectedLayerId with selectedShapeId (avoid loop by checking equality)
  useEffect(() => {
    if (selectedLayerId && selectedLayerId !== selectedShapeId) {
      selectShapeById(selectedLayerId);
    }
  }, [selectedLayerId, selectedShapeId, selectShapeById]);

  return (
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
        <ShapeRenderer
          shapes={shapes}
          currentShape={currentShape}
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
  );
};

export default Canvas;
