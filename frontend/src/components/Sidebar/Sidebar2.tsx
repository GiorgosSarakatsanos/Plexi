// src/components/sidebar/Sidebar.tsx
import React from "react";
import SizeSelector from "../SizeSelection/SizeSelector";
import ColorPickerButton from "../ColorPickerButton/ColorPickerButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import LayerPanel from "../Layer/LayerList";
import "./SidebarStyle.css";

interface SidebarProps {
  onSizeSelect: (width: number, height: number, unit: string) => void;
  handleColorChange: (color: string) => void;
  showMarginLines: boolean;
  setShowMarginLines: (show: boolean) => void;
  margins: { top: string; right: string; bottom: string; left: string };
  handleMarginChange: (updatedMargins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  }) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSizeSelect,
  handleColorChange,
  showMarginLines,
  setShowMarginLines,
  onClose,
}) => {
  return (
    <div className="sidebar-container">
      <button onClick={onClose} className="close-button">
        X
      </button>
      <div className="sidebar" id="image-options">
        <h2>01. Canvas</h2>
        <div className="stack-container">
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
        </div>
        <div className="stack-container">
          <div className="inline-container">
            <div>
              <h3>Canvas fill:</h3>
            </div>
            <div>
              <ColorPickerButton onChangeColor={handleColorChange} />
            </div>
          </div>
        </div>
        <div className="stack-container">
          <div className="inline-container">
            <div className="inline-container space-between">
              <h3>Margins</h3>
            </div>
            <div>
              <ToggleButton
                isToggled={showMarginLines}
                onToggle={() => setShowMarginLines(!showMarginLines)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar" id="layer-options">
        <h2>02. Layers</h2>
        <h3>Layers</h3>
        <LayerPanel />
      </div>
      <div className="sidebar" id="file-browser">
        <h2>03. Create</h2>
      </div>
      <div className="sidebar" id="page-options">
        <h2>04. Browse</h2>
      </div>
      <div className="sidebar" id="page-options">
        <h2>05. Print</h2>
      </div>
      <div className="sidebar" id="share-options">
        <h2>06. Share</h2>
      </div>
    </div>
  );
};

export default Sidebar;
