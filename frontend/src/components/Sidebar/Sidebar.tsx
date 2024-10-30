// src/components/sidebar/Sidebar.tsx
import React from "react";
import SizeSelector from "../SizeSelection/SizeSelector";
import ColorPickerButton from "../ColorPickerButton/ColorPickerButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import FourSidedInput from "../FourSidedInput/FourSidedInput";
import LayerPanel from "../Layer/LayerPanel";
import { marginInputData } from "../FourSidedInput/FourSidedInputData";

import "./SidebarStyle.css";

interface SidebarProps {
  activeButton: string | null;
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
  onClose: () => void; // New prop for closing sidebar
}

const Sidebar: React.FC<SidebarProps> = ({
  activeButton,
  onSizeSelect,
  handleColorChange,
  showMarginLines,
  setShowMarginLines,
  handleMarginChange,
  onClose,
}) => {
  return (
    <div className="sidebar-container">
      <button onClick={onClose} className="close-button">
        X
      </button>
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
  );
};

export default Sidebar;
