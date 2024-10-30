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
import { LayerProvider } from "./components/Layer/LayerContext";

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

  // Define activeButton and setActiveButton to control the sidebar
  const [activeButton, setActiveButton] = useState<string | null>("canvas");

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
        <div className="topbar-wrapper">
          <div className="logo">
            <span>Logo</span>
          </div>
          <div className="topbar-container">
            <div className="topbar">
              <Toolbar setSelectedShape={setSelectedShape} />
            </div>
          </div>
        </div>

        <div className="main-wrapper">
          <div className="menubar-container">
            {/* Pass activeButton and setActiveButton to Statebar */}
            <Statebar
              activeButton={activeButton}
              setActiveButton={setActiveButton}
            />
          </div>

          <div className="sidebar-container">
            {activeButton === "canvas" && (
              <div className="sidebar" id="image-options">
                <h2>01. Canvas</h2>
                <h3>Image size</h3>
                <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
                <h3>Canvas color</h3>
                <ColorPickerButton onChangeColor={handleColorChange} />
                <ToggleButton
                  isToggled={showMarginLines}
                  onToggle={() => setShowMarginLines(!showMarginLines)}
                />
                <h3>Margins</h3>
                <FourSidedInput
                  {...marginInputData}
                  onValuesChange={handleMarginChange}
                />
              </div>
            )}
            {activeButton === "layers" && (
              <div className="sidebar" id="layer-options">
                <h2>02. Layers</h2>
                <h3>Layers</h3>
                <LayerPanel />
              </div>
            )}
            {activeButton === "create" && (
              <div className="sidebar" id="file-browser">
                <h2>03. Create</h2>
              </div>
            )}
            {activeButton === "browse" && (
              <div className="sidebar" id="page-options">
                <h2>04. Browse</h2>
              </div>
            )}
            {activeButton === "print" && (
              <div className="sidebar" id="page-options">
                <h2>05. Print</h2>
              </div>
            )}
            {activeButton === "share" && (
              <div className="sidebar" id="share-options">
                <h2>06. Share</h2>
              </div>
            )}
          </div>

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
        </div>
      </div>
    </LayerProvider>
  );
};

export default App;
