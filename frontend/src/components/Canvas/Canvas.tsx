import React, { useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ShapeFactory from "../Shape/ShapeFactory";
import MarginLines from "../MarginLines/MarginLines";
import { marginSettings } from "../MarginLines/MarginSettings";
import { useKonvaMouseEvents } from "../../hooks/useKonvaMouseEvents";
import { useLayerContext } from "../Layer/useLayerContext";
import { useShapeSelection } from "../../components/Shape/useShapeSelection";
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
  const { addLayer } = useLayerContext();

  // Use the custom shape management hook
  const { shapes, selectedShapeId, addShape, selectShapeById } =
    useShapeManagement();

  // Initialize shape selection after shapes and selectedShapeId are available
  const transformerRef = useShapeSelection(shapes, selectedShapeId); // Transformer for the selected shape

  // Simplified mouse event handling, shape creation is managed by addShape in the hook
  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useKonvaMouseEvents(
      selectedShape,
      (newShape: Shape) => {
        addShape(newShape, addLayer); // Use addShape from the hook
      },
      stageRef
    );

  useEffect(() => {
    const transformer = transformerRef.current;
    const selectedNode = stageRef.current?.findOne(`#shape-${selectedShapeId}`);
    if (selectedNode && transformer) {
      transformer.nodes([selectedNode]);
      transformer.getLayer()?.batchDraw();
    } else if (transformer) {
      transformer.nodes([]);
    }
  }, [selectedShapeId, shapes, transformerRef]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnShapeId = e.target?.attrs?.id;

    if (clickedOnShapeId) {
      selectShapeById(clickedOnShapeId); // Use selectShapeById from the hook
    } else {
      selectShapeById(null); // Deselect if clicking outside
    }

    handleMouseDown(e); // Continue with existing logic
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
          {shapes.map((shape) => (
            <ShapeFactory
              key={shape.id}
              shapeType={shape.type}
              isSelected={shape.id === selectedShapeId} // Pass isSelected prop
              {...shape}
              id={shape.id} // Ensure the shape has an id for selection
            />
          ))}

          {/* Transformer component for the selected shape */}
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
