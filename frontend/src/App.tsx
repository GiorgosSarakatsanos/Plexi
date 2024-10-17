import React, { useState } from "react";
import Toolbar from "./components/Button/Toolbar/Toolbar";
import Statebar from "./components/Button/Statebar/Statebar";
import Canvas from "./components/Canvas/Canvas";
import ColorPickerButton from "./components/Button/ColorPickerButton/ColorPickerButton";
import ToggleButton from "./components/Button/ToggleButton";
import SizeSelector from "./components/Input/Size/SizeSelector";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor";
import { shapeDataMap } from "./components/Shapes/ShapeDataMap";

import "./styles/App.css";
import "./index.css";

const App: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { color: backgroundColor, handleColorChange } = useColor();

  const [selectedShape, setSelectedShape] = useState<
    keyof typeof shapeDataMap | null
  >(null);

  const [showMarginLines, setShowMarginLines] = useState(false); // State to track margin lines visibility

  return (
    <div className="App">
      <div className="topbar-container">
        <div className="canvas-setup">
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
          <ColorPickerButton onChangeColor={handleColorChange} />
          <ToggleButton
            isToggled={showMarginLines} // Pass the toggle state to the button
            onToggle={() => setShowMarginLines(!showMarginLines)} // Toggle the margin lines state
          />
        </div>
        <div className="statebar">
          <Statebar />
        </div>
      </div>
      <div className="toolbar-container">
        <Toolbar setSelectedShape={setSelectedShape} />
      </div>
      <div className="canvas-container">
        <Canvas
          width={canvasSize.width}
          height={canvasSize.height}
          backgroundColor={backgroundColor}
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
          showMarginLines={showMarginLines} // Pass the margin line visibility state to the Canvas
        />
      </div>
    </div>
  );
};

export default App;
