import React, { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import Statebar from "./components/Statebar/Statebar";
import Canvas from "./components/Canvas/Canvas";
import ColorPickerButton from "./components/ColorPickerButton/ColorPickerButton";
import ToggleButton from "./components/ToggleButton/ToggleButton";
import SizeSelector from "./components/SizeSelection/SizeSelector";
import FourSidedInput from "./components/FourSidedInput/FourSidedInput";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor";
import { marginInputData } from "./components/FourSidedInput/FourSidedInputData";
import LayerPanel from "./components/Layer/LayerPanel";
import { LayerProvider } from "./components/Layer/LayerContext"; // Ensure correct path

import "./styles/App.css";
import "./index.css";

const App: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { color: backgroundColor, handleColorChange } = useColor();

  const [selectedShape, setSelectedShape] = useState<string | null>(null);
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
    setMargins(updatedMargins);
  };

  return (
    <LayerProvider>
      <div className="app-container">
        {/* Topbar (Canvas setup inline with statebar) */}
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
            />
          </div>
          <div className="statebar">
            <Statebar />
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <LayerPanel />
        </div>

        {/* Main Content (Canvas + Toolbar) */}
        <div className="main-content">
          <div className="canvas-container">
            <Canvas
              width={canvasSize.width}
              height={canvasSize.height}
              backgroundColor={backgroundColor}
              selectedShape={selectedShape}
              showMarginLines={showMarginLines}
              margins={margins}
            />
          </div>

          <div className="toolbar-container">
            <Toolbar setSelectedShape={setSelectedShape} />
          </div>
        </div>
      </div>
    </LayerProvider>
  );
};

export default App;
