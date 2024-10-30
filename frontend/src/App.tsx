import React, { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import Statebar from "./components/Statebar/Statebar";
import Canvas from "./components/Canvas/Canvas";
import Sidebar from "./components/Sidebar/Sidebar";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor";
import { LayerProvider } from "./components/Layer/LayerContext";
import "./styles/App.css";
import "./index.css";

const App: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { color: backgroundColor, handleColorChange } = useColor();

  const [showSidebar, setShowSidebar] = useState(true);
  const [activeButton, setActiveButton] = useState<string | null>("canvas");
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showMarginLines, setShowMarginLines] = useState(false);
  const [margins, setMargins] = useState({
    top: "24",
    right: "24",
    bottom: "24",
    left: "24",
  });

  const handleSetActiveButton = (id: string) => {
    if (activeButton === id) {
      setShowSidebar(!showSidebar); // Toggle sidebar visibility if the same button is clicked
    } else {
      setActiveButton(id);
      setShowSidebar(true); // Show sidebar when a new button is clicked
    }
  };

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
            <Toolbar setSelectedShape={setSelectedShape} />
          </div>
        </div>

        <div
          className={`main-wrapper ${
            showSidebar ? "with-sidebar" : "no-sidebar"
          }`}
        >
          <div className="menubar-container">
            <Statebar
              activeButton={activeButton}
              setActiveButton={handleSetActiveButton} // Use handleSetActiveButton here
            />
          </div>

          {showSidebar && (
            <Sidebar
              activeButton={activeButton}
              onSizeSelect={onSizeSelect}
              handleColorChange={handleColorChange}
              showMarginLines={showMarginLines}
              setShowMarginLines={setShowMarginLines}
              margins={margins}
              handleMarginChange={handleMarginChange}
              onClose={() => setShowSidebar(false)} // Close sidebar on button click
            />
          )}

          <div className="canvas-container">
            <Canvas
              width={canvasSize.width}
              height={canvasSize.height}
              backgroundColor={backgroundColor}
              selectedShape={selectedShape}
              showMarginLines={showMarginLines}
              margins={margins} // Ensure margins is used here
            />
          </div>
        </div>
      </div>
    </LayerProvider>
  );
};

export default App;
