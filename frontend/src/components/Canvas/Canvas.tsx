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
  opacity: number;
  zoomLevel: number;
}


const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor,
  selectedShape,
  opacity,
  zoomLevel,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  // Log zoom and dimension details
  useEffect(() => {
    console.log(`Canvas Dimensions: ${width}x${height}`);
    console.log(`Zoom Level: ${zoomLevel}`);
    console.log(
      `Displayed Dimensions: ${width * zoomLevel}x${height * zoomLevel}`
    );
  }, [width, height, zoomLevel]);

  const rgbaBackgroundColor = `${backgroundColor}${Math.round(
    (opacity / 100) * 255
  )
    .toString(16)
    .padStart(2, "0")}`;

  // Shape management hook
  const { shapes, selectedShapeId, addShape, selectShapeById } =
    useShapeManagement();

  // Access LayerContext and add a type guard
  const layerContext = useContext(LayerContext);
  if (!layerContext) {
    throw new Error("Canvas must be wrapped in a LayerProvider");
  }
  const { selectedLayerId, setSelectedLayerId } = layerContext;

  // Konva mouse events hook
  const { handleMouseDown, handleMouseMove, handleMouseUp, currentShape } =
    useKonvaMouseEvents(
      selectedShape,
      addShape,
      (id) => {
        selectShapeById(id);
        setSelectedLayerId(id);
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

  console.log(`Final canvas dimensions in pixels: ${width} x ${height}`);
  console.log(`Applied zoom level: ${zoomLevel}`);
  console.log(
    `Displayed dimensions on canvas: ${width * zoomLevel} x ${
      height * zoomLevel
    }`
  );

  return (
    <Stage
      width={width * zoomLevel} // Apply zoom level
      height={height * zoomLevel} // Apply zoom level
      scaleX={zoomLevel} // Apply zoom level to X scale
      scaleY={zoomLevel} // Apply zoom level to Y scale
      style={{ backgroundColor: rgbaBackgroundColor }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={stageRef}
    >
      <Layer>
        <ShapeRenderer shapes={shapes} currentShape={currentShape} />
        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  );
};

export default Canvas;
