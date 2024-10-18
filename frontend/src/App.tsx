// App.tsx
import React, { useState } from "react";
import Toolbar from "./components/Button/Toolbar/Toolbar";
import Statebar from "./components/Button/Statebar/Statebar";
import Canvas from "./components/Canvas/Canvas";
import ColorPickerButton from "./components/Button/ColorPickerButton/ColorPickerButton";
import ToggleButton from "./components/Button/ToggleButton";
import SizeSelector from "./components/Input/Size/SizeSelector";
import FourSidedInput from "./components/Input/FourSidedInput/FourSidedInput";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor";
import { shapeDataMap } from "./components/Shapes/ShapeDataMap";
import { marginInputData } from "./components/Input/FourSidedInput/FourSidedInputData";

import "./styles/App.css";
import "./index.css";

const App: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { color: backgroundColor, handleColorChange } = useColor();

  const [selectedShape, setSelectedShape] = useState<
    keyof typeof shapeDataMap | null
  >(null);
  const [showMarginLines, setShowMarginLines] = useState(false);
  const [margins, setMargins] = useState({
    top: "24",
    right: "24",
    bottom: "24",
    left: "24",
  });

  const handleMarginChange = (updatedMargins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  }) => {
    setMargins(updatedMargins); // Update margin values dynamically
  };

  return (
    <div className="App">
      <div className="topbar-container">
        <div className="canvas-setup">
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
          <ColorPickerButton onChangeColor={handleColorChange} />
          <ToggleButton
            isToggled={showMarginLines}
            onToggle={() => setShowMarginLines(!showMarginLines)}
          />
          <FourSidedInput
            {...marginInputData}
            onValuesChange={handleMarginChange}
          />{" "}
          {/* Pass margin change handler */}
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
          showMarginLines={showMarginLines}
          margins={margins} // Pass margins to the Canvas
        />
      </div>
    </div>
  );
};

export default App;
