import React, { useState } from "react";
import Toolbar from "./components/Button/Toolbar/Toolbar";
import Statebar from "./components/Button/Statebar/Statebar";
import Canvas from "./components/Canvas/Canvas";
import BackgroundColorPicker from "./components/Canvas/CanvasBackground";
import SizeSelector from "./components/Input/Size/SizeSelector";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useBackgroundColor } from "./hooks/useBackgroundColor";
import { shapeDataMap } from "./components/Shapes/ShapeDataMap"; // Import shapeDataMap

import "./styles/App.css";
import "./index.css";

const App: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { backgroundColor, handleColorChange } = useBackgroundColor();

  // Correct type definition here to match only string keys from shapeDataMap or null
  const [selectedShape, setSelectedShape] = useState<
    keyof typeof shapeDataMap | null
  >(null);

  return (
    <div className="App">
      <div className="toolbar-container">
        <div className="canvas-setup">
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
          <BackgroundColorPicker onChangeColor={handleColorChange} />
        </div>
        <div className="toolbar-wrapper">
          {/* Set the selected shape type when a button is clicked */}
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
          backgroundColor={backgroundColor}
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
        />
      </div>
    </div>
  );
};

export default App;
