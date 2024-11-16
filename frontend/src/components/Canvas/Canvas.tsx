import React, {
  useRef,
  useEffect,
  useContext,
  useImperativeHandle,
} from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeRenderer from "../Shape/ShapeRenderer";
import useKonvaMouseEvents from "../Shape/useKonvaMouseEvents";
import { useShapeManagement } from "../Shape/useShapeManagement";
import Konva from "konva";
import { LayerContext } from "../Layer/LayerProvider";
import { zoomIn, zoomOut, setZoomToPercentage } from "../Zoom/Zoom"; // Import the functions

interface CanvasProps {
  backgroundColor: string;
  selectedShape: string | null;
  opacity: number;
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
  width: string;
  height: string;
  onZoomChange: (zoomLevel: number) => void; // Correct type
}

export interface CanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomToPercentage: (percentage: number) => void;
  getStage: () => Konva.Stage | null;
}

const Canvas = React.forwardRef((props: CanvasProps, ref) => {
  const {
    backgroundColor,
    selectedShape,
    setSelectedShape,
    opacity,
    width,
    height,
    onZoomChange,
  } = props;

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const rgbaBackgroundColor = `${backgroundColor}${Math.round(
    (opacity / 100) * 255
  )
    .toString(16)
    .padStart(2, "0")}`;

  const { shapes, addShape, selectShapeById } = useShapeManagement();

  // Zoom function
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (stageRef.current) zoomIn(stageRef.current);
    },
    zoomOut: () => {
      if (stageRef.current) zoomOut(stageRef.current);
    },
    setZoomToPercentage: (percentage: number) => {
      if (stageRef.current) {
        setZoomToPercentage(stageRef.current, percentage);
        if (onZoomChange) {
          onZoomChange(percentage);
        }
      }
    },
    getStage: () => stageRef.current, // Expose the Konva Stage
  }));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // Invert zoom direction: scroll up to zoom in, scroll down to zoom out
      const direction = e.evt.deltaY < 0 ? 1 : -1; // Reverse the condition

      const newScale = Math.max(
        0.01,
        Math.min(oldScale * (direction > 0 ? 1.25 : 0.8), 250)
      ); // Constrain zoom

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();

      if (onZoomChange) {
        onZoomChange(Math.round(newScale * 100)); // Update zoom level
      }
    };

    stage.on("wheel", handleWheel);

    return () => {
      stage.off("wheel", handleWheel); // Clean up
    };
  }, [onZoomChange]); // Add `onZoomChange` to the dependency array

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
      setSelectedShape
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
      width={parseInt(width)}
      height={parseInt(height)}
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
});

export default Canvas;
