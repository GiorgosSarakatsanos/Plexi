import React, { useRef, useEffect, useContext } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeRenderer from "../Shape/ShapeRenderer";
import useKonvaMouseEvents from "../Shape/useKonvaMouseEvents";
import { useShapeManagement } from "../Shape/useShapeManagement";
import Konva from "konva";
import { LayerContext } from "../Layer/LayerProvider";

interface CanvasProps {
  backgroundColor: string;
  selectedShape: string | null;
  opacity: number;
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>; // Included here
}

const Canvas: React.FC<CanvasProps> = ({
  backgroundColor,
  selectedShape,
  setSelectedShape, // Add this line
  opacity,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const rgbaBackgroundColor = `${backgroundColor}${Math.round(
    (opacity / 100) * 255
  )
    .toString(16)
    .padStart(2, "0")}`;

  const { shapes, addShape, selectShapeById } = useShapeManagement();

  const layerContext = useContext(LayerContext);
  if (!layerContext) {
    throw new Error("Canvas must be wrapped in a LayerProvider");
  }
  const { layers, selectedLayerIds, setSelectedLayerIds } = layerContext;

  const { handleMouseDown, handleMouseMove, handleMouseUp, currentShape } =
    useKonvaMouseEvents(
      selectedShape,
      addShape,
      (id: string | null, ctrlKey: boolean, shiftKey: boolean) => {
        if (shiftKey && id !== null) {
          const lastSelectedIndex = layers.findIndex(
            (layer) =>
              layer.id === selectedLayerIds[selectedLayerIds.length - 1]
          );
          const clickedIndex = layers.findIndex((layer) => layer.id === id);

          if (lastSelectedIndex >= 0 && clickedIndex >= 0) {
            const [start, end] = [
              Math.min(lastSelectedIndex, clickedIndex),
              Math.max(lastSelectedIndex, clickedIndex),
            ];
            const rangeIds = layers
              .slice(start, end + 1)
              .map((layer) => layer.id);

            setSelectedLayerIds((prev) =>
              Array.from(new Set([...prev, ...rangeIds]))
            );
          }
        } else if (ctrlKey && id !== null) {
          setSelectedLayerIds((prev) =>
            prev.includes(id)
              ? prev.filter((layerId) => layerId !== id)
              : [...prev, id]
          );
        } else if (id !== null) {
          setSelectedLayerIds([id]);
        } else {
          setSelectedLayerIds([]);
        }

        selectShapeById(id);
      },
      stageRef,
      setSelectedShape // Pass `setSelectedShape` here
    );

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    const selectedNodes = selectedLayerIds
      .map((id) => stageRef.current?.findOne(`#shape-${id}`))
      .filter(Boolean) as Konva.Node[];

    if (selectedNodes.length) {
      transformer.nodes(selectedNodes);
      transformer.getLayer()?.batchDraw();
    } else {
      transformer.nodes([]);
    }
  }, [selectedLayerIds, shapes, stageRef]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
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
