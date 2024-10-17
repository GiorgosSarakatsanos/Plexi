import React, { useState } from "react";
import Toolbar from "./components/Button/Toolbar/Toolbar";
import Statebar from "./components/Button/Statebar/Statebar";
import Canvas from "./components/Canvas/Canvas";
import ColorPickerButton from "./components/Button/ColorPickerButton/ColorPickerButton"; // Directly import ColorPickerButton
import SizeSelector from "./components/Input/Size/SizeSelector";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor"; // Import the new hook
import { shapeDataMap } from "./components/Shapes/ShapeDataMap"; // Import shapeDataMap

import "./styles/App.css";
import "./index.css";

const App: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { color: backgroundColor, handleColorChange } = useColor(); // Use the new hook

  const [selectedShape, setSelectedShape] = useState<
    keyof typeof shapeDataMap | null
  >(null);

  return (
    <div className="App">
      <div className="toolbar-container">
        <div className="canvas-setup">
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
          <ColorPickerButton onChangeColor={handleColorChange} />{""}
        </div>
        <div className="toolbar-wrapper">
          <Toolbar setSelectedShape={setSelectedShape} />
        </div>
        <div className="statebar">
          <Statebar />
        </div>
      </div>
      <div className="canvas-container">
        <Canvas
          width={canvasSize.width}
          height={canvasSize.height}
          backgroundColor={backgroundColor} // Apply background color from the hook
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
        />
      </div>
    </div>
  );
};

export default App;
