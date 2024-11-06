import React, { useRef, useEffect, useContext } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeRenderer from "../Shape/ShapeRenderer";
import useKonvaMouseEvents from "../Shape/useKonvaMouseEvents";
import { useShapeManagement } from "../Shape/useShapeManagement";
import Konva from "konva";
import { LayerContext } from "../Layer/LayerContext";

interface CanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
  selectedShape: string | null;
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor,
  selectedShape,
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


    </Stage>
  );
};

export default Canvas;
